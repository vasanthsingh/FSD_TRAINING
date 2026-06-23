async function validateForm() {
    event.preventDefault()
    var rname = document.getElementById("name").value;
    var remail = document.getElementById("email").value;
    var rpassword = document.getElementById("password").value;
    var rcpassword = document.getElementById("confirm_password").value;

    if (rpassword != rcpassword) {
        alert("Pass MisMatch Re-Enter the password")
        return
    }
    let user = { name: rname, email: remail, password: rpassword, cpassword: rcpassword }

    let response1 = await fetch("http://localhost:8080/users", {
        method: "GET"
    })

    let users = await response1.json();
    if (users.find(e => e.email === remail)) {
        alert("Email ALready Exists")
        return
    }

    let existuser = users.some(e => e.email == remail)
    if (existuser) {
        alert("Mail Already Register Try Login")
        return
    }

    var response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    if (response) {
        window.location.href = "login.html"
    } else {
        alert("Server Error")
    }

}
async function validateLogin() {
    event.preventDefault()

    var lmail = document.getElementById("lmail").value;
    var lpass = document.getElementById("lpass").value

    const response = await fetch("http://localhost:8080/users", {
        method: "GET"
    })
    let res = await response.json()

    let existuser = res.find(e => e.email === lmail)
    if (existuser) {
        if (lpass !== existuser.password) {
            alert("Invalid Password")
            return
        }
        window.location.href = "dashboard.html"
    } else {
        alert("Email Doesnot Exist")
        return
    }


}

async function addStd(event) {
    event.preventDefault()

    var name = document.getElementById("name").value
    var branch = document.getElementById("branch").value
    var roll = document.getElementById("roll").value
    var cgpa = document.getElementById("cgpa").value

    const std = { name, branch, roll, cgpa }
    const response = await fetch("http://localhost:8080/students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(std)
    })
    if (response) {
        window.location.href = "view-student.html"
    } else {
        alert("Server error")
    }
}


async function viewStudents() {
    var studentTableBody = document.getElementsByTagName("tbody")[0]

    if (!studentTableBody) return

    const response = await fetch("http://localhost:8080/students", {
        method: "GET"
    })
    let students = await response.json()
    console.log(students)

    if (students.length === 0) {
        var row = document.createElement("tr")
        var td = document.createElement("td")
        td.colSpan = 6
        td.style.color = "red"
        td.textContent = "No Students Available"

        row.appendChild(td)
        studentTableBody.appendChild(row)
        return
    }

    students.forEach(function (student, index) {
        var row = document.createElement("tr")

        var name = document.createElement("td")
        name.textContent = student.name

        var roll = document.createElement("td")
        roll.textContent = student.roll

        var branch = document.createElement("td")
        branch.textContent = student.branch

        var cgpa = document.createElement("td")
        cgpa.textContent = student.cgpa

        var editCell = document.createElement("td")
        var editLink = document.createElement("a")
        editLink.href = "edit-student.html?index=" + index
        editLink.textContent = "edit"
        editCell.appendChild(editLink)

        var deleteCell = document.createElement("td")
        var deleteButton = document.createElement("button")
        deleteButton.textContent = "delete"
        deleteButton.onclick = function () {
            deleteStudent(index)
        }
        deleteCell.appendChild(deleteButton)

        row.appendChild(name)
        row.appendChild(roll)
        row.appendChild(branch)
        row.appendChild(cgpa)
        row.appendChild(editCell)
        row.appendChild(deleteCell)

        studentTableBody.appendChild(row)
    })
}

function getSelectedStudentIndex() {
    var params = new URLSearchParams(window.location.search)
    return params.get("index")
}

async function loadSelectedStudent() {
    var nameInput = document.getElementById("name")
    var rollNoInput = document.getElementById("roll")
    var branchInput = document.getElementById("branch")
    var cgpaInput = document.getElementById("cgpa")

    var selectedIndex = getSelectedStudentIndex()
    var response = await fetch("http://localhost:8080/students")
    let students = await response.json()
    var selectedStudent = students[selectedIndex]

    if (!selectedStudent) {
        return
    }

    nameInput.value = selectedStudent.name
    rollNoInput.value = selectedStudent.roll
    branchInput.value = selectedStudent.branch
    cgpaInput.value = selectedStudent.cgpa
}

async function deleteStudent(index) {
    var response = await fetch("http://localhost:8080/students")
    let students = await response.json()
    var selectedStudent = students[index]

    await fetch(`http://localhost:8080/students/${selectedStudent.id}`, {
        method: "DELETE"
    })
    window.location.reload();
}

async function saveStudent() {
    event.preventDefault()

    var selectedIndex = getSelectedStudentIndex()
    const response = await fetch("http://localhost:8080/students", {
        method: "GET"
    })
    var students = await response.json()
    const std = students[selectedIndex]
    var crtstd = {
        name: document.getElementById("name").value,
        roll: document.getElementById("roll").value,
        branch: document.getElementById("branch").value,
        cgpa: document.getElementById("cgpa").value,
    }
    const res = await fetch(`http://localhost:8080/students/${std.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(crtstd)
    })
    if (res) {
        window.location.href = "view-student.html"
    } else {
        console.log("error");
    }
}
document.addEventListener("DOMContentLoaded", viewStudents)
document.addEventListener("DOMContentLoaded", loadSelectedStudent)


