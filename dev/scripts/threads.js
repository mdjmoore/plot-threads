import React from 'react';

export default class Thread extends React.Component {
    constructor() {
        super();
        this.state = {
            editing: false,
            thread: {}
        };
        this.save = this.save.bind(this);
    }
    save(e) {
        e.preventDefault();
        const userID = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref(`/users/${userID}/${this.props.thread.key}`);
        dbRef.update({
            title: this.threadTitle.value,
            text: this.threadText.value
        });

        this.setState({
            editing: false
        });
    }
    render() {
        let editingTemp = (
            <span>
                <h4>{this.props.thread.title}</h4>
                <p>{this.props.thread.text}</p>
            </span>
        )
        if(this.state.editing) {
            editingTemp = (
                <form className="editForm" onSubmit={this.save}>
                    <div>
                        <input type="text" defaultValue={this.props.thread.title} name="title" ref={ref => this.threadTitle = ref}/>
                    </div>
                    <div>
                        <textarea defaultValue={this.props.thread.text} name="text" ref={ref => this.threadText = ref}/>
                    </div>
                    <input type="submit" className="editSubmit" value="Edit"/>
                </form>
            )
        }
        return (
            <div className="thread-container">
                <a href="#" onClick={() => this.setState({editing: true})}>
                    <i className="far fa-edit"></i>
                </a>
                <a href="#" onClick={() => this.props.removeThread(this.props.thread.key)}>
                    <i className="fas fa-times"></i>
                </a>
                {editingTemp}
            </div>
        )    
    }
}