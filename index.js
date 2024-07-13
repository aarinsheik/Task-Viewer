const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use( express.static(path.join(__dirname,'public')) )
app.set('view engine', 'ejs')

app.get('/' , (req, res )=>{
    fs.readdir(`./files`,(err,task_files)=>{           // we are using Node.JS file-system to read the task files
        console.log (`task files are :`, task_files)
        res.render('index',{ files : task_files})      // we are sending the text-files(Task-data) to index.ejs page to display the tasks
    })
})

app.get('/file/:filename' , (req, res)=>{
    fs.readFile(`./files/${req.params.filename}` , 'utf-8', (err, filedata)=>{
        res.render('task_details' ,{ file_details: filedata , file_name: req.params.filename} )
    })
})

app.get('/edit/:filename' , (req , res)=>{
    
})

app.post('/create', (req , res)=>{                      // This route is for getting the task-data from index.ejs that was sent using 'POST' method by frontend
    
    let tit_ar = req.body.title.split(' ')
    tit_ar = tit_ar.map( (val)=>{
        return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    })
    let tit = tit_ar.join('')

    fs.writeFile(`./files/${ tit }.txt` , req.body.details ,(err)=>{ 
        console.log('Successfully task added.')
        res.redirect('/')
    })

})

app.listen(3000,()=>{
    console.log('server is running on port 3000...')
})