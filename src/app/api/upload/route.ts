import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
];

// IPFS Gateway URLs for accessing content
const IPFS_GATEWAYS = [
  'https://superfoodstudio.mypinata.cloud/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
];

// Helper function to get optimized image URL (not exported from route handler)
function getOptimizedImageUrl(ipfsHash: string, width = 800, height = 600) {
  return `https://superfoodstudio.mypinata.cloud/ipfs/${ipfsHash}?img-width=${width}&img-height=${height}&img-fit=contain`;
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const authToken = authHeader?.replace('Bearer ', '') || req.cookies.get('privy-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.PRIVY_APP_SECRET!
    );
    
    try {
      await privy.verifyAuthToken(authToken);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file');
    const contentType = formData.get('contentType') || 'recipe';
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 }
      );
    }
    
    // Process images to optimize them
    let processedFile = file;
    
    if (file.type.startsWith('image/')) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      
      // Resize and optimize image
      const optimizedBuffer = await sharp(fileBuffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();
      
      // Create a new file from the optimized buffer
      processedFile = new File([optimizedBuffer], file.name, { 
        type: 'image/jpeg',
      });
    }
    
    // Create a new FormData for Pinata
    const pinataFormData = new FormData();
    
    // Convert File to buffer and add to Pinata form
    const buffer = Buffer.from(await processedFile.arrayBuffer());
    pinataFormData.append('file', buffer, {
      filename: processedFile.name,
      contentType: processedFile.type,
    });
    
    // Add metadata
    const metadata = {
      name: `Superfood-${contentType}-${Date.now()}`,
      keyvalues: {
        contentType,
        fileName: processedFile.name,
        fileType: processedFile.type,
        uploadDate: new Date().toISOString(),
      },
    };
    
    pinataFormData.append('pinataMetadata', JSON.stringify(metadata));
    
    // Configure options for Pinata
    const pinataOptions = {
      cidVersion: 1,
      wrapWithDirectory: false,
    };
    
    pinataFormData.append('pinataOptions', JSON.stringify(pinataOptions));
    
    // Send request to Pinata API
    const pinataResponse = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      pinataFormData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT}`,
          ...pinataFormData.getHeaders(),
        },
      }
    );
    
    const { IpfsHash } = pinataResponse.data;
    
    // Generate URLs for the uploaded file
    const urls = IPFS_GATEWAYS.map(gateway => `${gateway}${IpfsHash}`);
    
    // Include an optimized image URL if it's an image
    const response: any = {
      success: true,
      ipfsHash: IpfsHash,
      url: urls[0], // Primary URL
      backupUrls: urls.slice(1), // Backup URLs
    };
    
    // Add optimized URL if it's an image
    if (file.type.startsWith('image/')) {
      response.optimizedUrl = getOptimizedImageUrl(IpfsHash);
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    );
  }
} 