const STORYBLOK_ACCESS_TOKEN = process.env.STORYBLOK_ACCESS_TOKEN;

const fetchTemplate = async (templateId: string) => {
    const res: any = await fetch(
        `https://api-us.storyblok.com/v2/cdn/stories/${templateId}?token=${STORYBLOK_ACCESS_TOKEN}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    const response = await res.json();

    // retrieve file url from story block response
    const url = response.story.content.body[0].htmlFile.filename;
    // retrieve contents of the template file
    const contents: any = await fetch(url, {
        headers: {
            "Content-Type": "text/plain",
        },
    });

    const text = await contents.text();
    return text;
};

interface IdentifyTemplateRequest {
    product: string;
    notice_type: string;
}

const identifyTemplate = async (request: IdentifyTemplateRequest) => {
    // identify the right template based on given params
    // for poc hard coding
    return "disclosure";
};

export { identifyTemplate, fetchTemplate };
