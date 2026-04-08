const url = 'http://localhost:11434/api/generate'
const model = 'deepseek-v3.1:671b-cloud'



let request = "ВЫДАЙ ТОЛЬКО HTML код! Не изменя разметку и стили. Меняй только содержимое разметки (текст). И ВСЕ!!! Если тебе выдали ПОЛОВИНУ div блока, ЭТУ ПОЛОВИНУ И ОБРАБАТЫВАЙ, НЕ ДОПОЛНЯЙ РАЗМЕТКУ! Твоя задача переписать этот текст так ЧЕРЕЗВЫЧАЙНО ПРОСТО даже первокласник должен понять!"



chrome.contextMenus.create({
	id: "my-context-menu",
	title: "Выведем текст!",
	contexts: ["all"]
}, function () {
	console.log("Контекстное меню создано!")

})


chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId == "my-context-menu") {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			func: () => {
				return { 
					// document: document.documentElement.outerHTML,
					document_head: document.head.outerHTML,
					document_body: document.body.outerHTML,
					url: window.location.origin  
				}
			}
		}, async (infectionResult) => {
			const htmlContent = infectionResult[0].result
			console.log("Я начала, ня~")
			
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: model,
					prompt: request + "КОД: " + htmlContent.document_body,
					stream: false
				})
			})

			

			console.log("Я уже делаею, ня~")

			// Проверка на ошибки 
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}
			const data = await response.json()



			console.log("Мы закончили, ня~")



			chrome.storage.local.set({ 
				"documentHead": htmlContent.document_head,
				"documentBody": data.response,
				"baseURL": htmlContent.url

			}, 
			() => {
				console.log("HTML сохранен, ня~")
				chrome.tabs.create({
					url: "work.html"
				})
			})
		})
	}
	
})