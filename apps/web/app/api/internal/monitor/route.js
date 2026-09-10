import { createMockProvider, analyzeResponse } from "@visibility/core";
import { project, prompts, brand } from "../../../../lib/demo-data";

export async function POST(request){
  const expected=process.env.INTERNAL_JOB_SECRET;
  if(expected && request.headers.get("authorization") !== `Bearer ${expected}`) return Response.json({error:"unauthorized"},{status:401});
  const body=await request.json().catch(()=>({}));
  const providerId=body.provider || "chatgpt";
  const provider=createMockProvider(providerId);
  const selected=body.promptId ? prompts.filter(p=>p.id===body.promptId) : prompts;
  const data=[];
  for(const prompt of selected){
    const result=await provider.run({prompt,project});
    data.push({promptId:prompt.id,provider:providerId,...result,analysis:analyzeResponse({answer:result.answer,brand,competitors:project.competitors,citations:result.citations})});
  }
  return Response.json({mode:"deterministic-demo",data});
}
