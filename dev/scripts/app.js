import React from 'react';
import ReactDOM from 'react-dom';
import Threads from './threads.js'

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBbnGgDyifjDEq-vdh3OzIom5siYX5LeOw",
  authDomain: "plot-threads.firebaseapp.com",
  databaseURL: "https://plot-threads.firebaseio.com",
  projectId: "plot-threads",
  storageBucket: "",
  messagingSenderId: "729926240238"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      threads: [],
      loggedIn: false
    }

    this.showAside = this.showAside.bind(this);
    this.addThread = this.addThread.bind(this);
    this.showCreate = this.showCreate.bind(this);
    this.createAuthor = this.createAuthor.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        firebase.database().ref(`users/${user.uid}`).on('value', (res) => {
          const userData = res.val();
          const dataArray = [];
          for(let objectKey in userData) {
              userData[objectKey].key = objectKey;
              dataArray.push(userData[objectKey])
          }
          this.setState({
            threads: dataArray,
            loggedIn: true
          })
        });
      }
    })
    
  }

  showAside (e) {
    e.preventDefault();
    this.side.classList.toggle('pop-out')
  }

  showCreate (e) {
    e.preventDefault();
    this.newAuthorForm.classList.toggle('pop-out')
  }

  addThread(e) {
    e.preventDefault();
    const thread = {
      title: this.threadTitle.value,
      text: this.threadText.value
    };
    
    const userID = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref(`/users/${userID}`);

    dbRef.push(thread);
    
    this.threadTitle.value = '';
    this.threadText.value = '';
    this.showAside(e);
  }

  removeThread(threadID) {
    const userID = firebase.auth().currentUser.uid; 
    const dbRef = firebase.database().ref(`/users/${userID}/${threadID}`);
    dbRef.remove();
  }

  createAuthor(e) {
    e.preventDefault();
    const password = this.createPassword.value;
    const confirm = this.confirmPassword.value;
    if(password === confirm) {
      firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.showCreate(e);
      })
      .catch((err) => {
        alert('Something went wrong. 🤔 Please try again.')
      })
    } else {
      alter('Passwords must match')
    };
  }

  signIn() {

    console.log(`signing in`);
    const provider = new firebase.auth.GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account'
    });

    firebase.auth().signInWithPopup(provider)
      .then((user) => {
      });
  }

  signOut() {
    firebase.auth().signOut();
    this.setState({
      loggedIn: false
    })
    this.newAuthorForm.classList.toggle('pop-out');
  }

    showThreads() {
      if(this.state.loggedIn) {
        return this.state.threads.map((thread, i) => {
          return (
            <Threads thread={thread} key={`thread-${i}`} removeThread={this.removeThread} />
          )
        }).reverse()
      } else {
        return <h2 className="pleaseSignIn">Please sign in to see your threads</h2>
      }
    }

    render() {
      return (
        <div>
          <header>
            <h1>Plot-threads</h1>
            <nav>
              <a href="" onClick={this.showAside} className="newThread"><i className="fas fa-pencil-alt"></i></a>
              <a href="" className="create" onClick={this.showCreate}><i className="fas fa-user-plus"></i></a>
              <a href="" className="login"><i className="fas fa-user"></i></a>
            </nav>
          </header>
          <div className="newAuthorForm" ref={ref => this.newAuthorForm = ref}>
            <form action="" onSubmit={this.createAuthor}>
              
                <label htmlFor="createEmail">Email</label>
                <input type="email" name="createEmail" placeholder="email" ref={ref => this.createEmail = ref} />
              
                <label htmlFor="createPassword">Password</label>
                <input type="password" name="createPassword" placeholder="password" ref={ref => this.createPassword = ref} />
              
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="confirm password" ref={ref => this.confirmPassword = ref} />
        
                <input type="submit" className="buttonExtend" value="Create" />
                <p>Or sign in with <button onClick={this.signIn}>Google</button></p>

                <button onClick={this.signOut}>Sign Out</button>
            </form>
          </div>

          <section className="threads">
            <div className="wrapper">
                {this.showThreads()}
            </div>
          </section>
          
          <aside className="side" ref={ref => this.side = ref}>
            <form action="" onSubmit={this.addThread}>
              <h2>New Thread</h2>
              <label htmlFor="thread-title">Title:</label>
              <input type="text" placeholder="title" name="thread-title" ref={ref => this.threadTitle = ref }/>

              <label htmlFor="thread-text">Text</label>
              <textarea name="thread-text" placeholder="text" id="thread-text" ref={ref => this.threadText = ref }></textarea>

              <input type="submit" className="buttonExtend" value="Add Thread" />

            </form>
          </aside>
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
