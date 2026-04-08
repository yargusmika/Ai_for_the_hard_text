

chrome.storage.local.get(["documentHead", "documentBody", "baseURL"], async (result) => {
    if (result.documentBody && result.baseURL && result.documentHead) {
        

        const base = '<base href="' + result.baseURL + '">'
        let finalHTML = result.documentHead

        if (finalHTML.includes("<head>")) {
            finalHTML = finalHTML.replace("<head>", "<head>" + base)
            finalHTML += result.documentBody
        }
        else 
            finalHTML = base + finalHTML + result.documentBody
        
        document.open()
        document.write(finalHTML)
        document.close()
    } else {
        console.log("Данные не найдены в хранилище!")
    }

    console.log(result)
})

