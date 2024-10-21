

class LoginComponent extends HTMLElement {

    constructor() {
        super()
        this.#__init__()
    }
    
    #__init__() {
        const template = document.createElement('template')
        template.innerHTML = (String.raw`
            <main class="main-content  mt-0">
                <section>
                    <div class="page-header min-vh-75">
                        <div class="container">
                            <div class="row">
                                <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                                    <div class="card card-plain mt-8">
                                        <div class="card-header pb-0 text-left bg-transparent">
                                            <h3 class="font-weight-bolder text-info text-gradient" style="font-size: 25pt;">Login</h3>
                                            <p class="mb-0">Enter your username and password to sign in</p>
                                        </div>
                                        <div class="card-body">
                                            <form role="form">
                                                <label style="font-size: 9pt;">Username</label>
                                                <div class="mb-3">
                                                    <input id="username" type="text" class="form-control p-3" placeholder="Username" aria-label="Username" aria-describedby="email-addon">
                                                </div>
                                                <label style="font-size: 9pt;">Password</label>
                                                <div class="mb-3">
                                                    <input id="password" type="password" class="form-control p-3" placeholder="Password" aria-label="Password" aria-describedby="password-addon">
                                                </div>
                                                <div class="text-center">
                                                    <button type="button" class="btn bg-gradient-info w-100 mt-4 mb-0 p-3" style="font-size: 10pt;" id="signInButton">Sign in</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        `)
        this.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.#_addEvents()
    }

    #_addEvents(){
        const signInButton = document.getElementById('signInButton')
        const username = document.getElementById('username')
        const password = document.getElementById('password')
        if (signInButton) {
            signInButton.addEventListener('click', () => {
                loginUserButtonAction(username ? username.value : '', password ? password.value : '')
            })
        } else {
            console.log('button not found')
        }
    }

    disconnectedCallback() {
        
    }

}

customElements.define('login-component', LoginComponent)
