"use client"
import Webcam from 'react-webcam'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModel';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/Schema';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
    const [userAnswer,setuserAnswer]=useState('');
    const {user} = useUser();
    const [loading,setLoading]=useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        results.map((result)=>{
            setuserAnswer(prevAns=>prevAns+result?.transcript)
        })

      },[results])

      useEffect(()=>{
       if(!isRecording&&userAnswer.length>10){
        UpdateUserAnswerInDb();
       }

      },[userAnswer])

      const StartStopRecording=async()=>{
        if(isRecording){
            
            stopSpeechToText();
        
         
           
        }else{
            startSpeechToText();
        }
      }

      const UpdateUserAnswerInDb=async()=>{

        setLoading(true);
        const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
        ", User Answer"+userAnswer+",Depends on question and user answer for given interview question"+"Please give us rating for answer and feedback as area of improvement if any"+"in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResp = (result.response.text()).replace('```json','').replace('```','');
        const jsonFeedbackResp = JSON.parse(mockJsonResp);
        console.log(jsonFeedbackResp);

        const resp = await db.insert(UserAnswer).values({
          mockIdRef:interviewData?.mockId,
            question:mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAns:userAnswer,
            feedback:jsonFeedbackResp?.feedback,
            rating:jsonFeedbackResp?.rating,
            userEmail:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-yyyy')
        });

        if(resp){
            toast('User Answer Recorder Sucessfully');
            setuserAnswer('');
            setResults([]);
        }
        setResults([]);
        
        setLoading(false)
      }
  return (
    <div className='flex flex-col justify-center items-center'>

    <div className='flex flex-col mt-10 justify-center items-center rounded-lg p-5'>
       <img src="https://static.vecteezy.com/system/resources/previews/023/247/512/non_2x/business-web-camera-cartoon-illustration-vector.jpg" width={400} height={400} className='absolute' />

      <Webcam 
      mirrored={true}
      style={{
        height:300,
        width:'100%',
        zIndex:10,
      }}
      />
    </div>
    <Button disable={loading} variant="outline" onClick={StartStopRecording} className="my-10"> {isRecording ? <h2 className='text-red-600 flex justify-center items-center gap-2'><StopCircle/>Stop Recording</h2> : <h2 className='flex justify-center items-center gap-2'><Mic/>Star Recording</h2>}</Button>


    </div>
  )
}

export default RecordAnswerSection
