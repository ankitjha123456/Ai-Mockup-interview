"use client"
import { Button } from '@/components/ui/button'
import { MockInterview } from '@/utils/Schema'
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'

function Interview({params}) {

  const [interviewData,setInterviewData] = useState(null)
  const [webCamEnabble,setWebCamEnabble] = useState(false);
  useEffect(() => {
    console.log(params.interviewId)
    GetInterviewDetail();

  }, [])
  
  const GetInterviewDetail=async()=>{
    const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId,params.interviewId))
    console.log(result)
    setInterviewData(result[0]);
  }
  return (
    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className='flex flex-col mt-10 my-5 gap-5 '>
        <div className='flex flex-col p-5 rounded-lg border gap-5'>

        <h2 className='text-lg'>
         <strong>Job Role/Job Position:</strong>{interviewData ? interviewData.jobPosition : 'Loading...'}
        </h2>
        <h2 className='text-lg'>
        <strong>Job Description/Tech Stack:</strong>{interviewData ? interviewData.jobDesc : 'Loading...'}
        </h2>
        <h2 className='text-lg'>
            <strong>Job Experience:</strong>{interviewData ? interviewData.jobExperience : 'Loading...'}
        </h2>
        </div>
        <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
          <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
          <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_ADDITIONAL_INFORMTION}</h2>
        </div>
      </div>
      <div className='flex flex-col'>
        {
          webCamEnabble? <Webcam
          onUserMedia={()=>setWebCamEnabble(true)}
          onUserMediaError={()=>setWebCamEnabble(false)}
          mirrored={true}
          style={{
            height:400,
            width:400
          }}
          /> 
          :
          <>
         
          <WebcamIcon className='h-72 w-full p-20 bg-secondary rounded-lg border mt-10'/>
          <Button variant="ghost" onClick={()=>{setWebCamEnabble(true)}} className='mt-4'>Enable your WebCam and microphone</Button>
          </>
        }

        
        
      </div>
      </div>
      <div className='flex justify-end items-end'>
        <Link href={'/dashboard/interview/'+params.interviewId+'/Start'}>
        <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  )
}

export default Interview
