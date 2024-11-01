async function loadResult() {
    $('#example').DataTable().destroy();
    var uls = new URL(document.URL)
    var exam = uls.searchParams.get("exam");
    var url = 'http://localhost:8080/api/result/admin/find-by-exam?examId='+exam;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await response.json();
    console.log(list);
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].result.user.fullName}<br>${list[i].result.user.email}</td>
                    <td>${list[i].tongCauHoi}</td>
                    <td>${list[i].soTLSai}</td>
                    <td>${list[i].soTLDung}</td>
                    <td>${list[i].phanTram.toFixed(2)}%</td>
                    <td>${list[i].result.exam.coefficient}%</td>
                </tr>`
    }
    document.getElementById("listresult").innerHTML = main
    $('#example').DataTable();
}