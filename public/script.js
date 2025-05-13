document.addEventListener('DOMContentLoaded', () => {
    const endpointSelect = document.getElementById('endpoint-select');
    const paramsContainer = document.getElementById('params-container');
    const sendRequestBtn = document.getElementById('send-request');
    const responseDisplay = document.getElementById('response-display');
    
    // Define the parameters for each endpoint
    const endpointParams = {
        health: [],
        listSchools: [
            { name: 'latitude', type: 'number', placeholder: 'User latitude (e.g., 40.7128)', required: true },
            { name: 'longitude', type: 'number', placeholder: 'User longitude (e.g., -74.0060)', required: true }
        ],
        addSchool: [
            { name: 'name', type: 'text', placeholder: 'School name', required: true },
            { name: 'address', type: 'text', placeholder: 'School address', required: true },
            { name: 'latitude', type: 'number', placeholder: 'School latitude (-90 to 90)', required: true },
            { name: 'longitude', type: 'number', placeholder: 'School longitude (-180 to 180)', required: true }
        ]
    };
    
    // Define the endpoint URLs
    const endpointUrls = {
        health: 'https://schoolmanagement-fnrl.onrender.com/health',
        listSchools: 'https://schoolmanagement-fnrl.onrender.com/api/schools/listSchools',
        addSchool: 'https://schoolmanagement-fnrl.onrender.com/api/schools/addSchool'
    };
    
    // Define the HTTP methods for each endpoint
    const endpointMethods = {
        health: 'GET',
        listSchools: 'GET',
        addSchool: 'POST'
    };
    
    // Function to update parameter fields based on selected endpoint
    function updateParamFields() {
        const selectedEndpoint = endpointSelect.value;
        const params = endpointParams[selectedEndpoint];
        
        // Clear previous parameters
        paramsContainer.innerHTML = '';
        
        // Add new parameter fields
        params.forEach(param => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            const label = document.createElement('label');
            label.setAttribute('for', `param-${param.name}`);
            label.textContent = param.name;
            
            const input = document.createElement('input');
            input.setAttribute('type', param.type);
            input.setAttribute('id', `param-${param.name}`);
            input.setAttribute('name', param.name);
            input.setAttribute('placeholder', param.placeholder);
            if (param.required) {
                input.setAttribute('required', 'required');
            }
            
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            paramsContainer.appendChild(formGroup);
        });
        
        // No JSON editor for request body - we'll use the form fields directly
    }
    
    // Initialize parameter fields
    updateParamFields();
    
    // Update parameter fields when endpoint selection changes
    endpointSelect.addEventListener('change', updateParamFields);
    
    // Handle form submission
    sendRequestBtn.addEventListener('click', async () => {
        const selectedEndpoint = endpointSelect.value;
        const method = endpointMethods[selectedEndpoint];
        let url = endpointUrls[selectedEndpoint];
        
        try {
            responseDisplay.textContent = 'Loading...';
            
            let options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            // Handle different request types
            if (method === 'GET') {
                // For GET requests, add query parameters to URL
                const params = endpointParams[selectedEndpoint];
                if (params.length > 0) {
                    const queryParams = new URLSearchParams();
                    
                    params.forEach(param => {
                        const inputElement = document.getElementById(`param-${param.name}`);
                        if (inputElement && inputElement.value) {
                            queryParams.append(param.name, inputElement.value);
                        }
                    });
                    
                    url = `${url}?${queryParams.toString()}`;
                }
            } else if (method === 'POST') {
                // Build body from form fields
                const bodyData = {};
                endpointParams[selectedEndpoint].forEach(param => {
                    const inputElement = document.getElementById(`param-${param.name}`);
                    if (inputElement) {
                        bodyData[param.name] = inputElement.value;
                    }
                });
                options.body = JSON.stringify(bodyData);
            }
            
            // Make the API request
            const response = await fetch(url, options);
            const data = await response.json();
            
            // Display the response
            responseDisplay.textContent = JSON.stringify(data, null, 2);
            
            // Add success/error styling based on response
            if (response.ok) {
                responseDisplay.classList.remove('error');
                responseDisplay.classList.add('success');
            } else {
                responseDisplay.classList.remove('success');
                responseDisplay.classList.add('error');
            }
        } catch (error) {
            responseDisplay.textContent = `Error: ${error.message}`;
            responseDisplay.classList.remove('success');
            responseDisplay.classList.add('error');
        }
    });
});
