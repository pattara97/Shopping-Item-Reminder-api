//import queryfn from "./app/query";

const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const server = express();
//const CryptoJS = require("crypto-js");
const mysql = require('mysql');;


server.use(
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({
        extended: true
    })
);


//WebApp.connectHandlers.use(Meteor.bindEnvironment(server));

var mysqlConnection = mysql.createConnection({
    // host: '127.0.0.1',
    // user: 'root',
    // port: '3306',
    // password: '',
    // database: 'list',
    // multipleStatements: true

    host: 'u3r5w4ayhxzdrw87.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'majfb1ewdhcushqj',
    port: '3306',
    password: 'f5watfciqwra7m72',
    database: 'pjg691k33tangl92',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
// server.listen(8081, 'us-cdbr-iron-east-01.cleardb.net')



server.post('/login', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query('SELECT username,email,role FROM user where (username ="' + body.username + '" or email="' + body.username + '") and password="' + body.password + '";', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getData', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query('SELECT * FROM product order by timestamp DESC LIMIT 300;', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getHistory_true', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`SELECT history.history_id,history.name,history.user,history.timestamp,history.complete,sum(history_detail.amount) as 'amount',sum(history_detail.amount*product.price) as 'total'
    FROM history 
    join history_detail
    join product
    on history.history_id=history_detail.history_id&&history_detail.product_id=product.product_id
    where history.user="${body.user}" and (history.complete ="true" or history.complete = "half") and history_detail.status='true'
    group by  history.history_id,history.name,history.user,history.total,history.timestamp,history.complete
    order by timestamp desc`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getHistory_false', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`SELECT history.history_id,history.name,history.user,history.timestamp,history.complete,sum(history_detail.amount) as 'amount',sum(history_detail.amount*product.price) as 'total'
    FROM history 
    join history_detail
    join product
    on history.history_id=history_detail.history_id&&history_detail.product_id=product.product_id
    where history.user="${body.user}" and (history.complete ="false" or history.complete = "half") and history_detail.status='false'
    group by  history.history_id,history.name,history.user,history.total,history.timestamp,history.complete
    order by timestamp desc`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/savelist', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('INSERT INTO history (history_id,name, total, timestamp,user,complete,amount) VALUES ("' + body.history_id + '", "' + body.name + '","' + body.total + '", "' + body.timestamp + '", "' + body.user + '","' + body.complete + '",' + body.amount + ');', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/savehistorylist', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query('INSERT INTO history_detail (history_id,product_id, amount,status) VALUES ("' + body.history_id + '","' + body.product_id + '",' + body.amount + ',"' + body.status + '");', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/addproduct', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('INSERT INTO product ( name, detail,typegroup, type, size, timestamp, price, pic) VALUES ( "' + body.name + '",  "' + body.detail + '", "' + body.typegroup + '","' + body.type + '",  "' + body.size + '", "' + body.timestamp + '", "' + body.price + '", "' + body.pic + '");', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/register', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('INSERT INTO user ( username, name, lname,gender, password, email,timestamp,role) VALUES ( "' + body.username + '",  "' + body.name + '", "' + body.lname + '","' + body.gender + '", "' + body.password + '",  "' + body.email + '", "' + body.timestamp + '", "' + body.role + '");', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getHistoryListtrue', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`select *,his.amount*product.price as 'total' from (SELECT history.history_id,history.user,history.timestamp,history_detail.history_detail_id,history_detail.amount,history_detail.product_id,history_detail.status  
        FROM history 
        join history_detail 
        on history.history_id=history_detail.history_id 
        where history.history_id="${body.list_id}" and history_detail.status="true") his join product on his.product_id=product.product_id`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getHistoryListfalse', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`select *,his.amount*product.price as 'total' from (SELECT history.history_id,history.user,history.timestamp,history_detail.history_detail_id,history_detail.amount,history_detail.product_id,history_detail.status  
        FROM history 
        join history_detail 
        on history.history_id=history_detail.history_id 
        where history.history_id="${body.list_id}" and history_detail.status="false") his join product on his.product_id=product.product_id`, (err, rows, fields) => {
        // and history_detail.status="true"
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/select_list', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('SELECT history_detail_id FROM history_detail where history_id="' + body.list_id + '";', (err, rows, fields) => {
        if (!err) {

            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/delect_his_list', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('delete FROM history_detail where history_detail_id="' + body.his_id + '";', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/delete_list', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('delete FROM history where history_id="' + body.list_id + '";', (err, rows, fields) => {
        if (!err) {

            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/listproduct', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('select * FROM product ;', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getproduct', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('select * FROM product where product_id="' + body.product_id + '";', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/editproduct', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('UPDATE product SET name = "' + body.name + '", detail = "' + body.detail + '", typegroup = "' + body.typegroup + '", type = "' + body.type + '", size = "' + body.size + '", timestamp = "' + body.timestamp + '", price = "' + body.price + '", pic = "' + body.pic + '" WHERE (product_id = "' + body.product_id + '");', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/deleteproduct', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('delete from product where product_id="' + body.product_id + '";', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/editlist', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('UPDATE history SET  total = "' + body.total + '", timestamp = "' + body.timestamp + '" WHERE (history_id = "' + body.history_id + '");', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/edithistorylist', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('UPDATE history_detail SET amount = ' + body.amount + ', status = "' + body.status + '" WHERE (history_detail_id = "' + body.history_detail_id + '");', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getTypeGroupProduct', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('SELECT typegroup FROM product GROUP BY typegroup;', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getTypeProduct', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('SELECT type FROM product where typegroup="' + body.typegroup + '" GROUP BY type;', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getProductByType', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('SELECT * FROM product where type="' + body.type + '";', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getHistoryName', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('SELECT * FROM history where history_id="' + body.history_id + '";', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/addCountUse', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query('SELECT countuse FROM product where product_id="' + body.product_id + '";', (err, rows, fields) => {
        if (!err) {
            let c = parseInt(rows[0].countuse) + 1
            mysqlConnection.query('update product set countuse=' + c + ' where product_id=' + body.product_id + ';', (err, rows, fields) => {
                if (!err) {
                    res.send(rows);
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    })
});
server.post('/getProfile', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('SELECT * FROM user where username="' + body.username + '";', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/maxprice', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('SELECT max(price) as maxprice FROM product;', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getlistallmonth', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`SELECT MONTH(history.timestamp) as 'MONTH',YEAR(history.timestamp) as 'YEAR',sum(history_detail.amount) as 'amount',product.price,
    sum(history_detail.amount*product.price) as 'sum'
    FROM history
    join history_detail
    join product
    on history.history_id = history_detail.history_id and history_detail.product_id=product.product_id
    where history.user='${body.username}' and history_detail.status='true' and MONTH(history.timestamp)='${body.MONTH}' and YEAR(history.timestamp)='${body.YEAR}'
    group by MONTH(history.timestamp),YEAR(history.timestamp) 
    order by YEAR(history.timestamp) desc,MONTH(history.timestamp) desc 
    `, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getlistalltype', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`SELECT MONTH(history.timestamp) as 'MONTH',YEAR(history.timestamp) as 'YEAR',date(history.timestamp) as 'date',sum(history_detail.amount) as 'amount',product.price,
    sum(history_detail.amount*product.price) as 'sum' 
    FROM history
    join history_detail
    join product
    on history.history_id = history_detail.history_id and history_detail.product_id=product.product_id
    where history.user='${body.username}' and history_detail.status='true'
    group by MONTH(history.timestamp),YEAR(history.timestamp),date(history.timestamp) 
    order by YEAR(history.timestamp),MONTH(history.timestamp),date(history.timestamp) desc`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getlistall', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`SELECT MONTH(history.timestamp) as 'MONTH',YEAR(history.timestamp) as 'YEAR',date(history.timestamp) as 'date',sum(history_detail.amount) as 'amount',product.price,
    sum(history_detail.amount)*product.price as 'sum',product.type
    FROM history
    join history_detail
    join product
    on history.history_id = history_detail.history_id and history_detail.product_id=product.product_id
    where history.user='${body.username}' and history_detail.status='true'
    group by MONTH(history.timestamp),YEAR(history.timestamp),date(history.timestamp) ,product.type 
    order by YEAR(history.timestamp),MONTH(history.timestamp),date(history.timestamp)`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getlistalldata', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`SELECT MONTH(history.timestamp) as 'MONTH',YEAR(history.timestamp) as 'YEAR',date(history.timestamp) as 'date',sum(history_detail.amount) as 'amount',product.price,
    sum(history_detail.amount)*product.price as 'sum',product.name,product.type
    FROM history
    join history_detail
    join product
    on history.history_id = history_detail.history_id and history_detail.product_id=product.product_id
    where history.user='${body.username}' and history_detail.status='true'
    group by MONTH(history.timestamp),YEAR(history.timestamp),date(history.timestamp),product.name,product.type 
    order by YEAR(history.timestamp),MONTH(history.timestamp),date(history.timestamp)`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/gethistorylast', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`SELECT * FROM history
    WHERE (complete= 'false' OR complete= 'half') and user='${body.username}'
    order by timestamp desc
    LIMIT 1
    `, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/gethistorylastdetail', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query('select * from (SELECT history.history_id,history.user,history.total,history.timestamp,history_detail.history_detail_id,history_detail.amount,history_detail.product_id,history_detail.status  FROM history join history_detail on history.history_id=history_detail.history_id where history.history_id="' + body.list_id + '") his join product on his.product_id=product.product_id', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/gethistory_id', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`SELECT history.history_id, history.name,MONTH(history.timestamp) as 'MONTH',YEAR(history.timestamp) as 'YEAR',date(history.timestamp) as 'date',sum(history_detail.amount*product.price) as 'sum'   FROM history 
    join history_detail
    join product
    on history.history_id=history_detail.history_id&&history_detail.product_id=product.product_id
    where history.user='${body.username}' and history_detail.status='true'
	group by  history.history_id,product.type`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getteype/byhistoryid', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`SELECT MONTH(history.timestamp) as 'MONTH',YEAR(history.timestamp) as 'YEAR',date(history.timestamp) as 'date',product.type
    FROM history
    join history_detail
    join product
    on history.history_id = history_detail.history_id and history_detail.product_id=product.product_id
    where history.user='${body.username}' and history_detail.status='true'
    group by MONTH(history.timestamp),YEAR(history.timestamp),date(history.timestamp) ,product.type
    order by YEAR(history.timestamp),MONTH(history.timestamp),date(history.timestamp) desc ,product.type`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/gettdata/byhistoryid', (req, res) => {
    const {
        body
    } = req;

    mysqlConnection.query(`SELECT MONTH(history.timestamp) as 'MONTH',YEAR(history.timestamp) as 'YEAR',date(history.timestamp) as 'date',product.type,product.name,history_detail.amount,product.price,history_detail.amount*product.price  as 'sum'
	FROM history 
    join history_detail
    join product
    on history.history_id=history_detail.history_id&&history_detail.product_id=product.product_id
    where history.user='${body.username}' and history_detail.status='true'`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});

server.post('/edit/name', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`UPDATE history SET name='${body.name}' WHERE history_id='${body.history_id}'`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getyear/select', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`SELECT max(year(timestamp)) as 'max',min(year(timestamp)) as 'min' FROM history WHERE user='${body.username}';`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getyear/his/false', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`SELECT YEAR(timestamp) as 'year' FROM history
    WHERE user='${body.user}' AND (complete='false' OR complete='half')
    GROUP BY YEAR(timestamp) desc`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getmount/his/false', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`SELECT month(timestamp) as 'month' FROM history
    WHERE user='${body.user}' AND (complete='false' OR complete='half')
    GROUP BY month(timestamp) desc`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getyear/his/true', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`SELECT YEAR(timestamp) as 'year' FROM history
    WHERE user='${body.user}' AND (complete='true' OR complete='half')
    GROUP BY YEAR(timestamp) desc`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/getmount/his/true', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`SELECT month(timestamp) as 'month' FROM history
    WHERE user='${body.user}' AND (complete='true' OR complete='half')
    GROUP BY month(timestamp) desc`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/checkdupproduct', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`select * from product where name='${body.name}' and detail='${body.detail}'`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
server.post('/checkdupproductedit', (req, res) => {
    const {
        body
    } = req;
    mysqlConnection.query(`select * from product where product_id!='${body.product_id}' and name='${body.name}' and detail='${body.detail}'`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});
