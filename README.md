# Notice service POC

## How to run

1. Generate AWS credentials
    ```saml2aws login```
2. Set AWS creds profile
    `export AWS_PROFILE=est-development-Okta-Development-Eng`
3. Run the service
    `npm run dev`

## Types of API requests

1. Request for a secure document with an auto generated passcode
```
curl --location 'http://localhost:3000/api/generate' \
--header 'Content-Type: application/json' \
--data '{
    "secure": true,
    
    "metadata": {
        "firstName": "John",
        "date": "09/27/23",
        "declineReasons": [
            {
                "reason": "Low FICO Score",
                "explanation": "Your FICO is 699 and we need at least 700"
            },
            {
                "reason": "Ineligible State",
                "explanation": "You live in NY. No good"
            }
        ]
    }
}'
```
The response should include a link to retrieve the document along with the passcode
```
{
    "link": "http://localhost:3000/api/retrieve?code=754510",
    "code": "754510"
}
```

2. Provide the passcode instead of an auto generated one
```
curl --location 'http://localhost:3000/api/generate' \
--header 'Content-Type: application/json' \
--data '{
    "secure": true,
    "secure_code": "12466",

    "metadata": {
        "firstName": "John",
        ...
    }
}
```

3. Download the document 
```
curl --location 'http://localhost:3000/api/generate' \
--header 'Content-Type: application/json' \
--data '{
    "download": true,

    "metadata": {
        "firstName": "John",
        ...
    }
}'
```