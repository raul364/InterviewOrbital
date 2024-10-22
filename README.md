# Orbital Usage API

## Overview
This project provides a simple Flask API that aggregates usage data for the Orbital Copilot system. It calculates credits used based on user messages sent in the current billing period.

## Requirements
- Python 3.7+
- Flask
- Flask_cors
- Requests
- regex
- dotenv

### Instructions:

1. Clone the repository.
2. Install dependencies:
```pip install -r requirements.txt```
3. Run the API:
```python app.py```
4. Visit http://localhost:5000/usage to see the usage data.
5. go into usage-dashboard folder and run npm install
``` cd usage-dashboard``` ``` npm install```
6. run ```npm start```


### Reasons for Certain Choices

1. Data Visualization with Chart.js and react-chartjs-2:

- I used Chart.js and react-chartjs-2 in tandem to visualize data efficiently and effectively.
- These libraries offer extensive customizability, allowing me to tailor the appearance and behavior of charts to fit specific design requirements and user needs.
- Chart.js provides a variety of chart types, including bar charts, which can be easily implemented and customized through the react-chartjs-2 wrapper, making integration with React seamless.
- The documentation and community support for both libraries facilitate quick troubleshooting and implementation of advanced features.

References:

- Chart.js Documentation
- react-chartjs-2 GitHub Repository

2. Regex Optimization with ChatGPT:

- I used ChatGPT to produce and optimize regular expressions (regex), which significantly enhanced my productivity.
- This approach allowed me to focus more on writing the application logic rather than spending excessive time figuring out the right regex combinations for data validation and manipulation.
- The ability to quickly generate and refine regex patterns helped streamline development, reducing potential errors and increasing the overall quality of the code

3. I've left in.env files for the purpose of this interview. in real world scenario they would be excluded and a template would be available if required