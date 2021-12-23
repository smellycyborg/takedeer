// TODO: it is not detecting req.session.user for the log in state

// Server Variables 
const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

// Password Variables
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const  PORT = 3001;
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
};
app.use(cors(corsOptions));

const sessionOptions = {
    key: 'userId',
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expries: 60 * 60 * 24,
    },
}

app.use(session(sessionOptions));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'users',
});

app.post('/create', (req, res) => {
    const { username, password, confirmPassword } = req.body;
    const sqlSearch = "SELECT * FROM userstable WHERE username = ?";
    const sqlInsert = "INSERT INTO userstable (username, password) VALUES (?, ?)";
    const searchQuery = mysql.format(sqlSearch, username);

    db.query(searchQuery, async(error, result) => {
        if (error) {
            return console.log(error);
        };

        if (result.length > 0) {
            return console.log({message: "user already exists"});
        };

        if (password !== confirmPassword) {
            return console.log({message: "passwords don't match"});
        };

        let hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = mysql.format(sqlInsert, [username, hashedPassword]);

        db.query(insertQuery, (error, result) => {
            if (error){
                console.log(error)
            } else {
                return res.json({message: 'user created'})
            }
        });
    });
});

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) {
        res.send('need token')
    } else {
        jwt.verify(token, 'mySecret', (error, decoded) => {
            if (error) {
                res.json({auth: false, message: 'failed to authorize'})
            } else {
                req.userId = decoded.id;
                next()
            };
        });
    };
};


app.get('authentication', verifyJWT, (req, res) => {
    res.send('you are authorized')
});

app.get('/login', (req, res) => {

    console.log(req.session.user)
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user});
        console.log({message: 'logged in = true'})
    } else {
        res.send({ loggedIn: false });
        console.log({message: 'logged in = false'})
    }
});

app.post('/login:id', (req, res) => {
    const { username, password } = req.body;
    const sqlSearch = "SELECT * FROM userstable WHERE username = ?";
    const searchQuery = mysql.format(sqlSearch, username);

    db.query(searchQuery, (error, result) => {
        if (error) {
           return console.log(error);
        };

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (response) {
                    const id = result[0].id;
                    const token = jwt.sign({id}, 'mySecret', {
                        expiresIn: 300,
                    });
                    req.session.user = result;

                    const responseData = {
                        auth: true, 
                        token: token, 
                        result: result
                    };

                    return res.json(responseData);
                }
            });
        } else {
            res.send({message: 'wrong user'})
        };
    });
});

app.post('/find-items', (req, res) => {
    const username = req.body.username;
    console.log(username)
    const sqlSearch = "SELECT * FROM itemstable WHERE username = ?";
    const searchQuery = mysql.format(sqlSearch, username);

    db.query(searchQuery, (error, result) => {
        if (error) {
            return console.log(error)
        }
        if (result) {
            res.send(result);
        } else {
            console.log({message: 'couldnt find items'})
        }
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.params.id)
    const sqlDelete = "DELETE FROM itemstable WHERE id = ?";
    const deleteQuery = mysql.format(sqlDelete, id)

    db.query(deleteQuery, (error, result) => {
        if (error) {
            return console.log(error)
        }

        res.send(result);
    });
});

app.put('/edit/:id', (req, res) => {
    const { item, spent, net, date, id, username } = req.body;
    console.log(req.body);
    const sqlUpdate = "UPDATE itemstable SET item = ?, spent = ?, net = ?, date = ? WHERE id = ?";
    const updateQuery = mysql.format(sqlUpdate, [item, spent, net, date, id]);

    const sqlSearch = "SELECT * FROM itemstable WHERE username = ?"
    const searchQuery = mysql.format(sqlSearch, username);

    db.query(updateQuery, (error, result) => {
        if (error) {
            return console.log(error);
        }

        db.query(searchQuery, (error, result) => {
            if (error) {
                return console.log(error)
            }

            res.send(result);
        });
    });
});

app.post('/add-item', (req, res) => {
    const { item, spent, net, date, username } = req.body;
    const sqlInsert = "INSERT INTO itemstable (item, spent, net, date, username) VALUES (?, ?, ?, ?, ?)";
    const insertQuery = mysql.format(sqlInsert, [item, spent, net, date, username]);

    db.query(insertQuery, (error, result) => {
        if (error) {
            return console.log(error);
        }

        res.send(result);
    });
});

app.post('/logout', (req, res) => {
    const username = req.body.username;

    // TODO: end session and get rid of cookie when log out
});

app.listen(PORT, () => {
    console.log({message: 'server running'});
});