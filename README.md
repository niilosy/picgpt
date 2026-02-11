App published at https://niilosy.github.io/picgpt/

This was a school project of mine originally in a mobile app development course. I decided to make a picture analyzer app with AI.

These were my first prototypes in Figma and color palettes.

<img width="718" height="481" alt="image" src="https://github.com/user-attachments/assets/1c7febf6-6963-4248-a783-86cc54a7bc54" />


Then I planned the functionality and flow of the app to work like this

<img width="1027" height="376" alt="image" src="https://github.com/user-attachments/assets/0566480b-26d4-441c-8ee3-7381875ef105" />

Then I got around to working on the app. The frontend I developed using Ionic React, which combines the React JavaScript framework with Ionic’s mobile-optimized UI components. 
I installed capacitor camera on the page to allow taking and submitting photos. Then started working on the backend to receive the photos and send to OpenAI API and output the response it gives. 

The backend was built with Node.js and Express. It exposes a REST endpoint at /analyze which receives the image from the frontend and securely forwards it to the OpenAI Responses API, and then outputs the response on the page. 

The prompt that goes with the photos to OpenAI is "Describe what’s in this photo. Give a guess where in the world you think it was taken", I thought it would be cool to see how well the AI could estimate where it was taken (not very well).

The frontend is deployed on GitHub Pages and the backend on Render. Because I'm on a free tier of render, the server will fall asleep sometimes and make the requests take longer.

All an all I was happy with the final project and I think it works just like the prototypes I made earlier.
