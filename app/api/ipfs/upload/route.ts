// app/api/ipfs/upload/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { IncomingForm } from 'formidable'
import { readFileSync, createReadStream } from 'fs'
import { mkdir, stat } from 'fs/promises'
import { join } from 'path'
import pinataSDK from '@pinata/sdk'

export const config = {
  api: {
    bodyParser: false,
  },
}

const pinata = new pinataSDK(
    process.env.PINATA_API_KEY!,
    process.env.PINATA_SECRET_API_KEY!
  )
  
export async function POST(req: NextRequest) {
  console.log('Received request to /api/ipfs/upload')

  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true })

    form.parse(req as any, async (err, fields, files) => {
      if (err || !files?.file) {
        console.error('Error parsing form:', err)
        return resolve(NextResponse.json({ error: 'Failed to parse file' }, { status: 400 }))
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file
      const fileStream = createReadStream(file.filepath)

      try {
        const result = await pinata.pinFileToIPFS(fileStream, {
          pinataMetadata: { name: file.originalFilename || 'uploaded-file' },
        })

        console.log('✅ Uploaded to Pinata:', result)
        return resolve(NextResponse.json({ ipfsHash: result.IpfsHash }))
      } catch (uploadError: any) {
        console.error('❌ Pinata upload error:', uploadError)
        return resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }))
      }
    })
  })
}
