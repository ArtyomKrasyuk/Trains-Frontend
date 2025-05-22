'use strict'

async function checkAuth(){
    let url = 'http://127.0.0.1:8080/admin/test';
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(!response.ok) window.location.href = 'loginadmin.html';
}

checkAuth();