# Cereal-Nutritional-Recommender

# Setup
1. add an .env file in the ./backend folder to store the Openai API key 
2. In mysql, create a database, right click on 'Tables', Click 'Table Data Import Wizard', give the wizard the crawford_80-cereals csv file to auto create the table with cereal data.
3. In the .env file add these variables with the corresponding information:
    OPENAI_API_KEY=
    DB_HOST=
    DB_PORT=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    KAGGLE_USERNAME=
    KAGGLE_KEY=
    KAGGLE_API_TOKEN=
4. cd into .\Cereal-Nutritional-Recommender\frontend\
5. run 'npm install'
6. cd into .\Cereal-Nutritional-Recommender\backend\
7. run 'npm install'

# Running Production Version of Website
1. create 2 terminals
2. in terminal two, CD into ./backend 
3. run 'node server.js' 
4. in terminal one, CD into ./frontend 
5. run 'npm run dev'
6. click the link that shows up in the terminal when 'npm run dev' is run
