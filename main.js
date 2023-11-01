axios.defaults.headers.common['Authorization'] =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';


// GET REQUEST
async function getTodos() {
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5');
    showOutput(res);
  }
  catch (err) {
    console.error(err);
  }
}

// POST REQUEST
function addTodo() {
  axios({
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/posts',
    data: {
      userId: 11,
      title: 'something',
      completed: false,
    }
  })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.error(err);
    })
}

// PUT/PATCH REQUEST
async function updateTodo() {
  try {
    const res = await axios.patch('https://jsonplaceholder.typicode.com/posts/100',
      {
        title: 'patch method used',
      });
    showOutput(res);
  }
  catch (err) {
    console.error(err);
  }

}

// DELETE REQUEST
function removeTodo() {
  axios.delete('https://jsonplaceholder.typicode.com/posts/1')
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.error(err);
    })
}

// SIMULTANEOUS DATA
function getData() {
  Promise.all([axios.get('https://jsonplaceholder.typicode.com/posts'),
  axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5')])
    .then(([posts, todos]) => {
      showOutput(todos);
      console.log(posts);
      console.log(todos);
    })
    .catch((err) => {
      console.error(err);
    })

}

// CUSTOM HEADERS
function customHeaders() {
  const headerObj = {
    'Content-Type': 'application/json',
    Authorization: 'sometoken'
  }

  axios.post('https://jsonplaceholder.typicode.com/todos',
    {
      title: 'New-Todo',
      completed: false,
      headers: headerObj,
    })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.error(err);
    });

}

// ERROR HANDLING
async function errorHandling() {
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/todoss');
      showOutput(res);
  }
  catch(err){
    if(err.response){
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);

      if(err.response.status===404){
        alert('Error: Page Not Found');
      }
    }
    else if(err.request){
      crossOriginIsolated.log(err.request.message)
    }
    else{
      console.log(err.message)
    }
  }
}



// CANCEL TOKEN
function cancelToken() {
  console.log('Cancel Token');
}

//AXIOS INSTANCE CREATION
const axiosInstance= axios.create({
  baseURL:'https://jsonplaceholder.typicode.com',
});

//RESPONSE INTERCEPTOR FOR AXIOS INSTANCE
axiosInstance.interceptors.response.use((res) =>{
  if(res.data && typeof res.data === 'object') {
    res.data = transformResponse(res.data);
  }
  return res;
},
  (err) => {
    return Promise.reject(err);
  });

// AXIOS INSTANCES GET HANDLED
axiosInstance.get('/comments')
.then((res)=>{
  showOutput(res);
})
.catch((err)=>{console.error});


// INTERCEPTING REQUESTS & RESPONSES

//REQUEST INTERCEPTOR
axios.interceptors.request.use((config) => {
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().toString()}`);
  return config;
},
  (err) => {
    return Promise.reject(err);
  });

//RESPONSE INTERCEPTOR
axios.interceptors.response.use((res) =>{
  if(res.data && typeof res.data === 'object') {
    res.data = transformResponse(res.data);
  }
  return res;
},
  (err) => {
    return Promise.reject(err);
  });


// TRANSFORMING REQUESTS & RESPONSES
function transformResponse(data) {
  const keyArr = Object.keys(data);

  //making title in upperCase through recursive method by passing objectKey as argument 
  keyArr.forEach((key) => {
    if (typeof data[key] === 'string' && key ==='body'){
      data[key] = data[key].toUpperCase();
    }
    else if (typeof data[key] === 'object') {
      data[key] = transformResponse(data[key]);
    }

  });

  return data;
}

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document.getElementById('transform').addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
