
//Features of the Project -
//If you have numerous Files in a folder and they are not Properly arranged
//So you can use this tool to arrange them in specific directory according to their extension
// like text files will go into text File Folder .exe files will go into application folder and so on
// so at the end you will have a arranged set of files in specific folders

//js mein input Array ke from mein jaata hai and that is array is process.argv Array

const fs = require("fs");
const { connect } = require("http2");
const { type } = require("os");

const path = require("path");
const { basename } = require("path/posix");
const { isGeneratorFunction } = require("util/types");

let inputArr = process.argv.slice(2); // [organzie , folderpath]

let command = inputArr[0];

let types = {
    media: ["mp4", "mkv", "mp3"],
    picture:["jpg" , "jpeg" , "png"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: [
      "docx",
      "doc",
      "pdf",
      "xlsx",
      "xls",
      "odt",
      "ods",
      "odp",
      "odg",
      "odf",
      "txt",
      "ps",
      "tex",
    ],
    app: ["exe", "dmg", "pkg", "deb"],
  };
  

switch (command) {
  case "tree":
  treefn(inputArr[1])
    break;
  case "organize":
    organizeFn(inputArr[1]);
    break;
  case "help":
    helpFn();
    break;
  default:
    console.log("Please enter a Valid command");
    break;
}

// Help Function will list all the ways by which you can run the commands of this project
function helpFn() {
  console.log(`List of all the commands->
                                 1)Tree - node FO.js tree <dirPath>
                                 2)organize - node FO.js organize <dirPath>
                                 3)help - node FO.js help`);
}

// Organize Function will organize all your target folder's files in a different folders acc to their extensions
function organizeFn(dirPath) { // we need a directory path as parameter 
  let destPath;
  if (dirPath == undefined) {
    console.log("Please enter a valid Directory Path");
    return;
  } // check whether directory path is passed or not and if not simply return

  let doesExist = fs.existsSync(dirPath);

  // this doesExist will tell the Target Folder exists or not

  if (doesExist == true) {
    destPath = path.join(dirPath, "organized_Files"); //dirPath=testfolder
    // C:\Users\Samad\Desktop\codes\webd lecture\testfolder\organized_Files

    // we created a path for organized_Files Folder

    // check whether in the given destPath does a folder exist with same name and if does not make a folder
    if (fs.existsSync(destPath) == false) {
      fs.mkdirSync(destPath);
    } else {
      console.log("Folder Already Exists");
    }
  } else {
    console.log("Please Enter A valid Path");
  }

  organizeHelper(dirPath , destPath)
}




function organizeHelper(src , dest){
     let childNames = fs.readdirSync(src)
     //console.log(childNames)

   for(let i=0 ; i<childNames.length;i++){
         let childAddress = path.join(src , childNames[i])
        //  C:\Users\Samad\Desktop\codes\webd lecture\testfolder\abc.mp3
         let isFile = fs.lstatSync(childAddress).isFile()

         if(isFile==true){
        //    console.log(childAddress)
        let fileCategory=getCategory(childNames[i])   //fileCAtegory==media

        sendFile(childAddress,dest,fileCategory)   

        // console.log(childNames[i]+'belong to '+fileCategory)
         // console.log(fileCategory)
       }
       
   }

}

function getCategory(fileName){  //fileName== abc.mp3
    let ext=path.extname(fileName);  //ext== .mp3
    ext=ext.slice(1);               // ext ==  mp3
    // console.log(ext);

    for(let key in types){   //for loop for object
       let ctypeArr=types[key]  //key = media , ctypeArr=[["mp4", "mkv", "mp3"]

       for(let i=0;i<ctypeArr.length;i++){
           if(ext==ctypeArr[i])    //if(mp3==mp3)
           return key          //key=media
       }

             
    }
    return 'others'
 
}

//destFilepath==organised folder address
//srcfilepath==fileAddress( C:\Users\Samad\Desktop\codes\webd lecture\testfolder\abc.mp3  )
function sendFile(srcfilepath,destFilepath,fileCategory){

let catpath=path.join(destFilepath,fileCategory)
 // C:\Users\Samad\Desktop\codes\webd lecture\testfolder\organized_Files\media

if (fs.existsSync(catpath) == false) 
    fs.mkdirSync(catpath)

    let fileName=path.basename(srcfilepath)
// fileName==abc.mp3
    
    let destPath=path.join(catpath,fileName)
    // C:\Users\Samad\Desktop\codes\webd lecture\testfolder\organized_Files\media\abc.mp3  (empty path)
    // console.log(destPath);
    
    
    fs.copyFileSync(srcfilepath,destPath);  //now on dest path there is a file
    // console.log(destPath);

    fs.unlinkSync(srcfilepath) //now delete the file from its previous position
}


function treefn(dirPath)
{
  if (dirPath == undefined)
 { console.log("Please enter a valid Directory Path");
 return;

  }
   else{
    let doesExist = fs.existsSync(dirPath);
    if(doesExist==true){
      indent=" ";
      treeHelper(dirPath,indent)
      // console.log(dirPath)
    }
   }

}

function treeHelper(dirPath,indent){
  indent=indent+"  "

 let isFile=fs.lstatSync(dirPath).isFile();
 if(isFile==true){
   fileName=path.basename(dirPath)
    console.log(indent +"├───"+fileName);
 }
 else {
   indent=indent+"  "
   let folderName=path.basename(dirPath)
   console.log(indent+"└──"+folderName)
   let childNames=fs.readdirSync(dirPath);
   
   for(let i=0;i<childNames.length;i++){
     let childAddress=path.join(dirPath,childNames[i])
      treeHelper(childAddress,indent)
   }
 }


}