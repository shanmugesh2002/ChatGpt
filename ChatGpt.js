const formValues=document.querySelector('.typingform');
const chatList=document.querySelector('.user-chat-application');
const toggleLightMode=document.querySelector('#Light-Mode');
const DeletingItems=document.querySelector('#Deleting-items');
const suggestionList=document.querySelectorAll('.information-list .lists');

let userInput=null;
const API_KEY="AIzaSyDA7EWZOTzj7VphutK6itY-IAprWUph88I"
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash
:generateContent?key=${API_KEY}`


/* THE CREATECHILDELEMENT ITS CREATING THE PARENT DIV ELEMENT */
const createChildElement=(content,...className)=>{
const div=document.createElement("div");
div.classList.add("message",...className);
div.innerHTML=content;
return div;
}


const wordsTypingEffect=(text,textElement,incomingMsg)=>{
const words=text.split(' ');
let currentIndex=0;

const typingInterval=setInterval(()=>{
textElement.innerText+=(currentIndex === 0?'':' ' )+words[currentIndex++]
chatList.scrollTo(0,chatList.scrollHeight);
incomingMsg.querySelector('.icon').classList.add('hide');
if(currentIndex === words.length){
    clearInterval(typingInterval);
    incomingMsg.querySelector('.icon').classList.add('hide');
   
}
},75)
}
/* ITS COLLECTING THE VALUE FROM THE API AND DISPLAYED IN INCOMING MSG */
const ApiResponse=async(incomingMsg)=>{
    const textMsg=incomingMsg.querySelector('.text');
try{
const response=await fetch(API_URL,{
    method:"POST",
    headers:{"Content-Type": "application/json"},
    body:JSON.stringify({
        contents:[{
            role:"user",
            parts:[{ text:userInput}]
        }]
    })
});
const data=await response.json();
if(!response.ok) throw new Error(data.err.message);


const ApiResponse=data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,'$1');
wordsTypingEffect(ApiResponse,textMsg,incomingMsg)
}catch(err){
    textMsg.classList.add('error');
}finally{
    incomingMsg.classList.remove("loading");//WHEN THE TEXT IS DISPLAYED
    // AUTOMATICALLY THE LOADING CLASS REMOVED IN THE FINNALY
}
}
const copyMessage=(copyMsg)=>{
    let userCopyMsg=copyMsg.parentElement.querySelector('.text').innerText;
    navigator.clipboard.writeText(userCopyMsg);
}
 /* CHAT LOADING APPLICATION  */
const chatLoadingApplication=()=>{
    const html=` <div class="message-content">
                <img class="avatar" src="./geminilogo.png" alt="geminiLogo">
                <p class="text"></p>
                     <div class="loading-indicator">
                        <div class="loadingbar"></div>
                        <div class="loadingbar"></div>
                        <div class="loadingbar"></div>
                     </div>
            </div>
            <i class="fa-regular fa-copy icon" onclick="copyMessage(this)"></i>`;

const incomingElementValues=createChildElement(html,"incoming","loading");
chatList.appendChild(incomingElementValues);
ApiResponse(incomingElementValues);
}

 /* HANDLE THE USER VALUE  */
const handleUserValue=()=>{
userInput=formValues.querySelector('.userprompt').value.trim() || userInput;

if(!userInput) return;

formValues.querySelector('.userprompt').value="";

const html=`<div class="message-content">
                <img class="avatar" src="./portfoliosideimg.jpg" alt="user-profile-logo">
                <p class="text"></p>
            </div>`;

const myDivElementValues=createChildElement(html,"outgoing");
myDivElementValues.querySelector('.text').innerText=userInput;
chatList.appendChild(myDivElementValues);
document.body.classList.add("hide-header");
setTimeout(chatLoadingApplication,500);

}
suggestionList.forEach(suggestions=>{
    suggestions.addEventListener('click',()=>{
        userInput=suggestions.querySelector('.text').innerText;
        handleUserValue();
    })
})

toggleLightMode.addEventListener('click',()=>{
    document.body.classList.toggle('light-mode');
})
DeletingItems.addEventListener("click",()=>{
    if(confirm("Are you sure to deleted this message")){
        while (chatList.firstChild) {
            chatList.removeChild(chatList.firstChild);
        }
        document.body.classList.remove('hide-header');
    }
   
})
formValues.addEventListener('submit',(e)=>{
    e.preventDefault();

    handleUserValue();
})
