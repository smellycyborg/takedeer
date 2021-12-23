// TODO: 
// - scrollbox for table
// - log out, end session

import '../css/App.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import moment from 'moment';
import { Icon } from '@iconify/react';

const User = () => {

    axios.defaults.withCredentials = true;

    let navigate = useNavigate();

    const [name, setName] = useState('');
    const [idState, setIdState] = useState('');
    const [itemsList, setItemsList] = useState([]);

    const hider = ({ id, item, spent, net, date }) => {
        // TODO: set different values for each input if multiple inputs are selected... 
        // unless...... write if statement saying if i'm editing an input i cannot edit another
        // setValues({
        //     item: item,
        //     spent: spent,
        //     net: net,
        //     date: date
        // });

        setIdState(id);

        const items = itemsList.map((item) => {
            if (item.id !== id) {
                return item;
            }

            return { ...item, isHidden: true };
        });

        setItemsList(items);
    };

    const renderData = () => {
        return itemsList.map((i, index) => {
            const { id, item, spent, net, date, isHidden } = i

            if (isHidden === true) {
                // return null;
                return (
                    <tr key={id}>
                        <th><input onChange={handleChangeNewList} placeholder={values.item} name='item' type='name' className='input--css2'/></th>
                        <th><input onChange={handleChangeNewList} placeholder={values.spent} name='spent' type='number' step='any' className='input--css2'/></th>
                        <th><input onChange={handleChangeNewList} placeholder={values.net} name='net' type='number'step='any' className='input--css2'/></th>
                        <th><input onChange={handleChangeNewList} placeholder={moment(values.date).format('MMM DD, YYYY')} name='date' type='date' className='input--css2'/></th>
                        <th><Icon icon="bi:check" onClick={editItem}/></th>
                    </tr>
                );
            }

            return (
                <tr key={id} >
                    <td>{item}</td>
                    <td>{spent}</td>
                    <td>{net}</td>
                    <td>{moment(date).format('MMM DD, YYYY')}</td>
                    <td>
                        <center>
                            <Icon icon="ant-design:edit-filled" onClick={() => {
                                hider( { id: id, item: item, spent: spent, net: net, date: date } );
                            }}/>
                            <Icon icon='ci:close-small' onClick={() => {
                                deleteItem( id );
                            }}/>
                        </center>
                    </td>
                </tr>
            );
        });
    }

    const [values, setValues] = useState({
        item: '',
        spent: 0,
        net: 0,
        date: new Date()
    });

    const [newList, setNewList] = useState({
        item: '',
        spent: 0,
        net: 0,
        date: new Date()
    });

    const [list, setList]= useState({
        item: '',
        spent: 0,
        net: 0,
        date: new Date()
    });

    const handleChangeNewList = (e) => {
        setNewList({
            ...newList,
            [e.target.name]: e.target.value
        });
    };
    
    const handleChangeList = (e) => {
        setList({
            ...list,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    // gets the users items 
    const findItems = () => {
        axios.post('http://localhost:3001/find-items', {
            username: name
        }).then((response) => {
            setItemsList(response.data);
            console.log(response.data);
            console.log(name)
        });
    };

    // function sets users name
    useEffect(() => {
        axios.get('http://localhost:3001/login').then((response) => {
            if (response.data.loggedIn === true) {
                setName(response.data.user[0].username);
                console.log(response.data);
            }
        });
    }, []);

    function addItem(e) {
        axios.post('http://localhost:3001/add-item', {
            ...list,
            [e.target.name]: e.target.value,
            username: name
        }).then((response) => {
            console.log(response)
        });
    };

    function deleteItem(id) {
        axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
            setItemsList(itemsList.filter((val) => {
                return val.id !== id;
            }));
        });
    };

    function editItem(e) {

        axios.put(`http://localhost:3001/edit/:${idState}`, {
            ...newList,
            [e.target.name]: e.target.value,
            id: idState,
            username: name
       }).then((response) => {
           setItemsList(response.data);
           console.log(response);
       });
    };

    function logOut() {
        // TODO: end session and cookies 

        // axios.post('http://localhost:3001/logout', {
        //     username: name
        // }).then(() => {
            navigate('/Home')
            // console.log('working')
        // });
    };

    return (
        <div className='container'>

            <div className='row mt-4'>
                <div className='col'>
                    <label className='pink'>hi {name}</label>
                    <button className='btn-sharp offset-10' onClick={logOut}>log out</button>
                </div>
            </div>

            <div className='row mt-4'>
                <div className='col offset-1'>
                    <form onSubmit={handleSubmit} className='form-inline'>
                        <div className='form-group'>
                            <label>item</label>
                            <input onChange={handleChangeList} name='item' type='name' className='input--css2' />

                            <label >spent</label>
                            <input onChange={handleChangeList} name='spent' type='number' step='any' className='input--css2' />

                            <label >net</label>
                            <input onChange={handleChangeList} name='net' type='number' step='any' className='input--css2' />

                            <label>date</label>
                            <input onChange={handleChangeList} name='date' type='date' className='input--css2' />

                            <button onClick={addItem} className='btn-sharp'>enter</button>
                            <button onClick={findItems} className='btn-sharp'>find</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className='row mt-4'>
                <table className='scrolldown'>
                    <thead>
                        <tr className='table--style'>
                            <th className='table--bro' scope='col'>item</th>
                            <th className='table--bro' scope='col'>spent</th>
                            <th className='table--bro' scope='col'>net</th>
                            <th className='table--bro' scope='col'>date</th>
                            <th className='table--bro' scope='col'>edit/del</th>
                        </tr>
                    </thead>
                    <tbody className='tbody'>
                        {renderData()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;