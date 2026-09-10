export class CmsAdapter {
  constructor(config){ this.config=config; }
  async publish(_article){ throw new Error("publish() must be implemented"); }
  async update(_publicationId,_article){ throw new Error("update() must be implemented"); }
  async remove(_publicationId){ throw new Error("remove() must be implemented"); }
}

export class WebhookCmsAdapter extends CmsAdapter {
  async publish(article){
    const response=await fetch(this.config.url,{method:"POST",headers:{"content-type":"application/json",...(this.config.token?{authorization:`Bearer ${this.config.token}`}:{})},body:JSON.stringify(article)});
    if(!response.ok) throw new Error(`CMS webhook failed: ${response.status}`);
    return response.json().catch(()=>({ok:true}));
  }
}

export const CMS_TYPES=["wordpress","webflow","ghost","shopify","notion","webhook"];
