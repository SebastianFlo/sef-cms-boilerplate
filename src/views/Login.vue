<template>
    <div class="container">
        <h2>Admin Login</h2>
        <p>Please enter your email and password</p>
        <form id="Login">
            <div>
                <input type="email" id="inputEmail" placeholder="Email Address">
            </div>

            <div>
                <input type="password" id="inputPassword" placeholder="Password">
            </div>

            <div>
                <a href="reset.html">Forgot password?</a>
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'login',
}
</script>

<style scoped lang="scss">
</style>