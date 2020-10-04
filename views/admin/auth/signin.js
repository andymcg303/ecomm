const layout = require('../../layout');

const getError = (errors, prop) => {
    try {
        return errors.mapped()[prop].msg;
    } catch (err) {
        return '';
    }
}

module.exports = () => {
    return layout({ 
        content: `
            <div>
                <form method="POST">
                    <input name="email" placeholder="email">
                    <input name="password" placeholder="password">
                    <button>Sign In</button>
                </form>
            </div>
        ` 
    });
}