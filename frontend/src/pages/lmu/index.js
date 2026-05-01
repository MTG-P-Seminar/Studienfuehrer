let applicationDocuments = new Set(JSON.parse(localStorage.getItem("lmu-application-documents") ?? "[]"))

document.querySelectorAll("#application-documents wa-checkbox").forEach((cb, i) => {
  if (applicationDocuments.has(i)) {
    cb.checked = true
  }

  cb.addEventListener("input", () => {
    if (applicationDocuments.has(i)) {
      applicationDocuments.delete(i)
    }
    else {
      applicationDocuments.add(i)
    }
    localStorage.setItem("lmu-application-documents", JSON.stringify(Array.from(applicationDocuments)))
  })
})
