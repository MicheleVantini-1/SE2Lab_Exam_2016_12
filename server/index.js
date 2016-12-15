//express lib
var express = require('express');
//general lib
var app = express();
//inspect
var util = require('util');
//Cross-Origin Resource Sharing (CORS), used for enabling pre-flight option
cors = require('cors');

//student manager
var studentManager = require('./studentManager.js');

//POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());// JSON

//set up the server
app.set('port', (process.env.PORT || 5000));
//enable pre-flight authoriuzation
app.options('*', cors());

/**
 * @brief returns a static welcome page.
 * @return a static page.
 */
app.get('/', function(request, response) 
{
	var headers = {};
	//answer
	headers["Content-Type"] = "text/html";
	response.writeHead(200, headers);
	response.end("Welcome student");
});

/**
 * @brief returns the list of students
 * @return a static page.
 */
app.get('/showList', function(request, response) 
{
	var headers = {};
	headers["Content-Type"] = "text/html";
	response.writeHead(200, headers);
	response.end(JSON.stringify(studentManager.getList()));
});

/**
 * @brief search a student
 * @return search a student using two parameters, one of them optional
 */
app.post('/searchStudent', function(request, response) 
{
	var headers = {};
	headers["Access-Control-Allow-Origin"] = "*";
	headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
	headers["Access-Control-Allow-Credentials"] = false;
	headers["Access-Control-Max-Age"] = '86400'; // 24 hours
	headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
	headers["Content-Type"] = "application/json";

	var studentID;
	
	//check body and parameters
	if ( typeof request.body !== 'undefined' && request.body)
	{
		if ( typeof request.body.ID !== 'undefined' && request.body.ID)
            {
			 studentID = request.body.ID;
            }
		else 
			studentID = "not defined";
	
	}
	else
	{
		studentID = "body undefined";
	}
    
    if (studentID!="not defined" && studentID!="body undefined")
	{
		//aceptable input
		//search for a student
		var student = studentManager.searchStudentID(studentID);
		//if exists
		if (student != null)
		{
			response.writeHead(200, headers);
			response.end(JSON.stringify(student));
		}
		else
		{
			response.writeHead(404, headers);
			response.end(JSON.stringify());
		}

	}
    else    
	{
		//unaceptable input
		response.writeHead(406, headers);
		response.end(JSON.stringify("1"));
	}   

});

/**
 * @brief delete a student
 * @return delete a student identified by his/her ID or SSN
 */
app.post('/deleteStudent', function(request, response) 
{
	var headers = {};
	headers["Access-Control-Allow-Origin"] = "*";
	headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
	headers["Access-Control-Allow-Credentials"] = false;
	headers["Access-Control-Max-Age"] = '86400'; // 24 hours
	headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
	headers["Content-Type"] = "application/json";

	var studentID;
	var studentSSN;
	
	//check body and parameters
	if ( typeof request.body !== 'undefined' && request.body)
	{
		if ( typeof request.body.ID !== 'undefined' && request.body.ID)
            {
			 studentID = request.body.ID;
            }
		else 
			studentID = "not defined";
		
		if ( typeof request.body.SSN !== 'undefined' && request.body.SSN)
            {
			 studentSSN = request.body.SSN;
            }
		else 
			studentSSN = "not defined";
	
	}
	else
	{
		studentID = "body undefined";
		studentSSN = "body undefined";
	}
    
	var student;
	
    if (studentID!="not defined" && studentID!="body undefined")
	{
		//aceptable input
		//delete a student using ID
		student = studentManager.deleteStudentID(studentID);
		if (student!= null)
		{
			response.writeHead(200, headers);
			response.end(JSON.stringify(student));
		}
		else
		{
			response.writeHead(404, headers);
			response.end(JSON.stringify());
		}

	}
	else if (studentSSN!="not defined" && studentSSN!="body undefined")
	{	
		//aceptable input
		//delete a student using ID
		student = studentManager.deleteStudentSSN(studentSSN);
		if (student!= null)
		{
			response.writeHead(200, headers);
			response.end(JSON.stringify(student));
		}
		else
		{
			response.writeHead(404, headers);
			response.end(JSON.stringify());
		}
	}
    else    
		{
        	//unaceptable input
        	response.writeHead(406, headers);
			response.end(JSON.stringify("1"));
		}   

});

/**
 * @brief add a student
 * @return add a student to the list of students
 */
app.post('/addStudent', function(request, response) 
{	
	var headers = {};
	headers["Access-Control-Allow-Origin"] = "*";
	headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
	headers["Access-Control-Allow-Credentials"] = false;
	headers["Access-Control-Max-Age"] = '86400'; // 24 hours
	headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
	headers["Content-Type"] = "application/json";

	var studentID;
	var studentSSN;
	var studentName;
	var studentAddress;
	var studentMark;
	
	//check body and parameters
	if ( typeof request.body !== 'undefined' && request.body)
	{
		if ( typeof request.body.ID !== 'undefined' && request.body.ID &&
			 typeof request.body.SSN !== 'undefined' && request.body.SSN &&
			 typeof request.body.name !== 'undefined' && request.body.name &&
			 typeof request.body.address !== 'undefined' && request.body.address &&
			 typeof request.body.mark !== 'undefined' && request.body.mark
		   )
            {
			 studentID = request.body.ID;
			 studentSSN = request.body.SSN;
			 studentName = request.body.name;
			 studentAddress = request.body.address;
			 studentMark = request.body.mark;
            }
		else 
			studentID = "not defined";
	}
	else
	{
		studentID = "body undefined";
	}
    
    if (studentID!="not defined" && studentID!="body undefined")
	{
		//aceptable input
		//create the student object
		var student = {
			ID: studentID,
			SSN: studentSSN,
			name: studentName,
			address: studentAddress,
			mark: studentMark
		}
		
		//if insertion works correctly
		if (studentManager.insertStudent(student))
		{
			response.writeHead(200, headers);
			response.end(JSON.stringify(student.name));
		}
		else
		{
			response.writeHead(400, headers);
			response.end(JSON.stringify());
		}

	}
    else    
	{
		//unaceptable input
		response.writeHead(406, headers);
		response.end(JSON.stringify("1"));
	}   

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/**
 * @brief search student by mark
 * @return the list of the student that match with the search query
 */
app.post('/searchByMark', function(request, response) 
{	
	var headers = {};
	headers["Access-Control-Allow-Origin"] = "*";
	headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
	headers["Access-Control-Allow-Credentials"] = false;
	headers["Access-Control-Max-Age"] = '86400'; // 24 hours
	headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
	headers["Content-Type"] = "application/json";

	var studentList = [];
	var searchQuery;
	
	//checking that the body and the parameter are present in the request
	if ( typeof request.body !== 'undefined' && request.body)
	{
		if ( typeof request.body.criteria !== 'undefined' && request.body.criteria )
    {
			 searchQuery = request.body.criteria;
			 
			 // checking that the length of the input is 2
			 // '<' or '>' plus a digit
			 if(searchQuery.length <= 2)
			 {
			 		// checking that the first char is '<' or '>' and that 
			 		// the second char is a digit
			 		if((searchQuery[0] === '<' || searchQuery[0] === '>') 
			 		&& (parseInt(searchQuery[1]) != NaN))
				  {
				  	
				 		var searchCriteria = (searchQuery[0] === '<') ? true : false;
				 		var searchMark = parseInt(searchQuery[1]);
				 		
				 		var list = studentManager.getList();
				 		
				 		var len = list.length;
				 		// looking for students that match the criteria
				 		for(var i = 0; i < len; i++)
				 		{
				 			if(searchCriteria)
				 			{
								if(list[i].mark < searchMark)
								{
									// if the student matches the criteria we 
									// add it to the result
									studentList.push(list[i]);
								}
				 			}
				 			else
				 			{
				 				if(list[i].mark > searchMark)
								{
									// if the student matches the criteria we 
									// add it to the result
									studentList.push(list[i]);
								}
				 			}
				 		} 
				  } 
			 }
			 
    }
			
	}
	
	// sending back the list of the students to the client
	response.writeHead(200, headers);
	response.end(JSON.stringify(studentList));
		  

});

