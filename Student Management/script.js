
function validateForm() {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    var confirm_pass = document.getElementById("confirm_password").value;
    if (pass != confirm_pass) {
        alert("Password mismatch");
        window.location.href = "register.html";
        return;
    }
    var obj = {
        "name": name,
        "email": email,
        "password": pass
    }
    window.localStorage.setItem('entry', JSON.stringify(obj));
    window.location.href = "login.html";
}

function login() {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var ent = JSON.parse(localStorage.getItem('entry'));
    var lname = ent.name;
    var lemail = ent.email;
    var lpass = ent.password;

    if (!ent || email != lemail) {
        alert("Invalid email");
        return;
    }
    if (password != lpass) {
        alert("Invalid password");
    }

    window.location.href = "dashboard.html";
}

function studentadd() {
    event.preventDefault();
    var sname = document.getElementById("name").value;
    var sroll = document.getElementById("roll").value;
    var sbranch = document.getElementById("branch").value;
    var cgpa = document.getElementById("cgpa").value;

    // Use array index for Edit/Delete (no stable id)
    var sarr = { sname, sroll, sbranch, cgpa };

    var existing = JSON.parse(localStorage.getItem('students')) || [];
    existing.push(sarr);

    localStorage.setItem('students', JSON.stringify(existing));
    console.log(localStorage.getItem('students'));
    window.location.href = "view-student.html";
}

function rendertable() {
    var tbodyList = document.getElementsByTagName("tbody");
    if (!tbodyList || tbodyList.length === 0) return;

    var tbody = tbodyList[0];
    tbody.innerHTML = "";

    var students = JSON.parse(localStorage.getItem('students')) || [];

    if (!Array.isArray(students) || students.length === 0) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.colSpan = 5;
        td.textContent = "No students added yet.";

        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    for (var i = 0; i < students.length; i++) {
        var s = students[i];

        var tr = document.createElement('tr');

        var tdName = document.createElement('td');
        tdName.textContent = s.sname;

        var tdRoll = document.createElement('td');
        tdRoll.textContent = s.sroll;

        var tdBranch = document.createElement('td');
        tdBranch.textContent = s.sbranch;

        var tdCgpa = document.createElement('td');
        tdCgpa.textContent = s.cgpa;

        var tdActions = document.createElement('td');

        if (!s.id) {
            s.id = Date.now().toString();
            students[i] = s;
            localStorage.setItem('students', JSON.stringify(students));
        }

        var editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.textContent = 'Edit';
        editBtn.id = 'editbtn'
        editBtn.style.marginLeft = '40px';
        editBtn.onclick = function (index) {
            return function () {
                window.location.href = "edit-student.html?index=" + encodeURIComponent(index);
            };
        }(i);


        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.textContent = 'Delete';
        delBtn.style.marginLeft = '120px';
        delBtn.onclick = function (index) {
            return function () {
                deleteStudent(index);
            };
        }(i);


        tdActions.appendChild(editBtn);
        tdActions.appendChild(delBtn);

        tr.appendChild(tdName);
        tr.appendChild(tdRoll);
        tr.appendChild(tdBranch);
        tr.appendChild(tdCgpa);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    }
}

function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function loadStudentForEdit() {
    if (!(window.location && window.location.href && window.location.href.includes('edit-student.html'))) return;

    var index = getQueryParam('index');
    if (index === null || index === undefined) return;

    var i = parseInt(index, 10);
    if (isNaN(i)) return;

    var students = JSON.parse(localStorage.getItem('students')) || [];
    var found = students[i];


    if (!found) return;
    var nameEl = document.getElementById('name');
    var rollEl = document.getElementById('roll');
    var branchEl = document.getElementById('branch');
    var cgpaEl = document.getElementById('cgpa');

    if (nameEl) nameEl.value = found.sname ?? '';
    if (rollEl) rollEl.value = found.sroll ?? '';
    if (branchEl) branchEl.value = found.sbranch ?? '';
    if (cgpaEl) cgpaEl.value = found.cgpa ?? '';
}

function deleteStudent(index) {
    var students = JSON.parse(localStorage.getItem('students')) || [];
    var i = parseInt(index, 10);
    if (isNaN(i)) return;

    students.splice(i, 1);
    localStorage.setItem('students', JSON.stringify(students));
    rendertable();
    window.location.href = 'view-student.html';
}

function editStudent() {
    event.preventDefault();

    var index = getQueryParam('index');
    if (index === null || index === undefined) return;

    var id = parseInt(index, 10);
    if (isNaN(id)) return;


    var sname = document.getElementById('name').value;
    var sroll = document.getElementById('roll').value;
    var sbranch = document.getElementById('branch').value;
    var cgpa = document.getElementById('cgpa').value;

    var students = JSON.parse(localStorage.getItem('students')) || [];
    var updated = false;

    if (students && students.length > id) {
        students[id].sname = sname;
        students[id].sroll = sroll;
        students[id].sbranch = sbranch;
        students[id].cgpa = cgpa;
        updated = true;
    }

    if (updated) {
        localStorage.setItem('students', JSON.stringify(students));
        window.location.href = 'view-student.html';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.location && window.location.pathname && window.location.pathname.includes('view-student.html')) {
        if (typeof rendertable === 'function') rendertable();
    }
    loadStudentForEdit();
});

