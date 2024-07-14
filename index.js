const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use( express.static(path.join(__dirname,'public')) )
app.set('view engine', 'ejs')

app.get('/' , (req, res )=>{
    fs.readdir(`./files`,(err,task_files)=>{              // we are using Node.JS file-system to read the task files
        console.log (`task files are :`, task_files)
        res.render('homepage',{ files : task_files})      // we are sending the text-files(Task-data) to homepage.ejs page to display the tasks
    })
})

app.get('/file/:filename' , (req, res)=>{                                                              // To create and add a new task
    fs.readFile(`./files/${req.params.filename}` , 'utf-8', (err, filedata)=>{
        res.render('task_details' ,{ file_details: filedata , file_name: req.params.filename} )
    })
})

app.get('/edit/:filename' , (req , res)=>{                                                             // To Edit a existing task
    fs.readFile(`./files/${req.params.filename}` , 'utf-8', (err, filedata)=>{                       
        res.render('edit_task' ,{ file_details: filedata , file_name: req.params.filename} )
    })
})

app.get('/complete/:filename' , (req, res)=>{                                                          // To delete the considering it to be completed
    fs.rm(`./files/${req.params.filename}`, (err)=>{       
        console.log('Successfully task removed.')
        res.redirect('/')
    })
})

app.post('/create', (req , res)=>{                      // This route is for getting the task-data from homepage.ejs that was sent using 'POST' method by frontend
    
    let tit_ar = req.body.title.split(' ')              // removing space in the name and making the first character into uppercase
    tit_ar = tit_ar.map( (val)=>{
        return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    })
    let tit = tit_ar.join('')

    fs.writeFile(`./files/${ tit }.txt` , req.body.details ,(err)=>{       // writing the content into a .txt file and saving it in files folder (NOTE: if file doesn't exist, it creates one.)
        console.log('Successfully task added.')
        res.redirect('/')
    })

})

app.post('/edit' , (req, res)=>{
    
    let tit_ar = req.body.edited_title.split(' ')
    tit_ar = tit_ar.map( (val)=>{
        return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    })
    let tit = tit_ar.join('')

    fs.rename(`./files/${req.body.prev_title}.txt` , `./files/${tit}.txt` , (err)=>{        // renaming the file to edited_title by user.
        fs.writeFile(`./files/${tit}.txt` , req.body.edited_details , (err)=>{              // re-writing the content of the edited_title file
            console.log('Successfully task Edited.')
            res.redirect('/')
        })
    })

})

app.listen(3000,()=>{
    console.log('server is running on port 3000...')
})