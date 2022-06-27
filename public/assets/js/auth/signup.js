const passwordCheck = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/
const phoneCheck = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd;
}

if (mm < 10) {
    mm = '0' + mm;
}
today = yyyy - 18 + '-' + mm + '-' + dd;
document.getElementById("dateOfBirth").setAttribute("max", today);

document.getElementById("password").addEventListener("change", () => {
    document.getElementById("password").classList.remove("error")
    document.getElementById("confirm-password").classList.remove("error")
    document.querySelectorAll('.errorMessageHelperPassword').forEach(e => e.remove());
})
document.getElementById("confirm-password").addEventListener("change", () => {
    document.getElementById("password").classList.remove("error")
    document.getElementById("confirm-password").classList.remove("error")
    document.querySelectorAll('.errorMessageHelperPassword').forEach(e => e.remove());

})
document.getElementById("phoneNo").addEventListener("change", () => {
    document.getElementById("phoneNo").classList.remove("error")
    document.querySelectorAll('.errorMessageHelperPhoneNo').forEach(e => e.remove());
})
document.getElementById("dateOfBirth").addEventListener("change", () => {
    document.getElementById("dateOfBirth").classList.remove("error")
    document.querySelectorAll('.errorMessageHelperDateOfBirth').forEach(e => e.remove());
})

const formSubmit = (e) => {

    let formData = {
        firstName: e.target.givenName.value,
        lastName: e.target.familyName.value,
        gender: e.target.gender.value,
        dateOfBirth: e.target.dateOfBirth.value,
        password: e.target.password.value,
        newPassword: e.target['confirm-password'].value,
        email: e.target.email.value,
        phoneNo: e.target.phoneNo.value
    }

    console.log(formData)
    if (formData.firstName && formData.lastName && formData.gender && formData.dateOfBirth && formData.password && formData.newPassword && formData.email) {
        let span = document.createElement("span");
        let errorCheck = false
        if (passwordCheck.test(formData.password)) {
            span.classList.add("errorMessageHelperPassword")
            if (formData.password !== formData.newPassword) {
                span.innerHTML = "Password mismatch"
                errorCheck = true
                document.getElementById("password").classList.add("error")
                document.getElementById("password").parentNode.appendChild(span)
                document.getElementById("confirm-password").classList.add("error")
                document.getElementById("confirm-password").parentNode.appendChild(span)

            }
        } else {
            errorCheck = true
            span.classList.add("errorMessageHelperPassword")
            span.innerHTML = "Password must contain at least 8 characters, 1 number, 1 upper and 1 lowercase"
            document.getElementById("password").classList.add("error")
            document.getElementById("password").parentNode.appendChild(span)
            document.getElementById("confirm-password").classList.add("error")
            document.getElementById("confirm-password").parentNode.appendChild(span)

        }
        if (new Date(formData.dateOfBirth) > new Date(today)) {
            errorCheck = true
            span.classList.add("errorMessageHelperDateOfBirth")
            span.innerHTML = "You should be 18 years or older"
            document.getElementById("dateOfBirth").classList.add("error")
            document.getElementById("dateOfBirth").parentNode.appendChild(span)

        }
        if (!phoneCheck.test(formData.phoneNo)) {
            errorCheck = true
            span.classList.add("errorMessageHelperPhoneNo")
            span.innerHTML = "Please enter a valid phone number"
            document.getElementById("phoneNo").classList.add("error")
            document.getElementById("phoneNo").parentNode.appendChild(span)


        }
        if (errorCheck) {
            e.preventDefault();
        }
    }

}

document.addEventListener("submit", formSubmit);
