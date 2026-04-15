let doneDocuments = new Set(JSON.parse(localStorage.getItem("tum-application-documents") ?? "[]"))

document.querySelectorAll("#documents wa-checkbox").forEach((cb, i) => {
  if (doneDocuments.has(i)) {
    cb.checked = true
  }

  cb.addEventListener("input", () => {
    if (doneDocuments.has(i)) {
      doneDocuments.delete(i)
    }
    else {
      doneDocuments.add(i)
    }
    localStorage.setItem("tum-application-documents", JSON.stringify(Array.from(doneDocuments)))
  })
})
