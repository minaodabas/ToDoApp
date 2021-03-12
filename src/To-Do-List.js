import React, { Component } from "react";
import axios from "axios";
import './todo.css';
let endpoint = "http://localhost:8080";
class ToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: "",
            items: []
        };
    }
    componentDidMount() {
        this.getTask();
    }
    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    onSubmit = () => {
        let { task } = this.state;
        // console.log("pRINTING task", this.state.task);
        if (task) {
            axios
                .post(
                    endpoint + "/api/task",
                    {
                        task
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )
                .then(res => {
                    this.getTask();
                    this.setState({
                        task: ""
                    });
                    console.log(res);
                });
        }
    };
    getTask = () => {
        axios.get(endpoint + "/api/task").then(res => {
            console.log(res);
            if (res.data) {
                this.setState({
                    items: res.data.map(item => {
                        let opacity = "1";
                        if (item.status) {
                            opacity = "0.4";
                        }
                        return (
                            <div className="cardContainer" style={{opacity: `${opacity}`}} key={item._id}>
                                <div className="todoText">{item.task}</div>
                                <div className="buttonContainer">
                                    <button onClick={() => this.updateTask(item._id)} className="buttonDone">Done</button>
                                    <button onClick={() => this.undoTask(item._id)} className="buttonUndo">Undo</button>
                                    <button onClick={() => this.deleteTask(item._id)} className="buttonDelete" >Delete</button>

                                </div>
                            </div>
                        );
                    })
                });
            } else {
                this.setState({
                    items: []
                });
            }
        });
    };
    updateTask = id => {
        axios
            .put(endpoint + "/api/task/" + id, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(res => {
                console.log(res);
                this.getTask();
            });
    };
    undoTask = id => {
        axios
            .put(endpoint + "/api/undoTask/" + id, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(res => {
                console.log(res);
                this.getTask();
            });
    };
    deleteTask = id => {
        axios
            .delete(endpoint + "/api/deleteTask/" + id, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(res => {
                console.log(res);
                this.getTask();
            });
    };
    deleteAll = () => {
        axios
            .delete(endpoint + "/api/deleteAllTask" , {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(res => {
                console.log(res);
                this.getTask();
                console.log(this.state);
            });
    };


    render() {
        return (
            <div className="container">
                <div className="header">
                    TO DO LIST
                </div>
                <div className="formRow">
                    <form onSubmit={this.onSubmit}>
                        <input
                            type="text"
                            name="task"
                            onChange={this.onChange}
                            value={this.state.task}
                            className="taskInput"
                        />
                        <button className="createButton">Create Task</button>
                    </form>
                    <button onClick={() => this.deleteAll()} className="deleteAllButton">Delete All Task</button>
                </div>
                <div className="cardRow">
                    {this.state.items}
                </div>
            </div>
        );
    }
}
export default ToDoList;