function deleteOldEmails() {

  const labelPaths = [
    "通知/中國信託",
    "通知/中華郵政",
    "通知/Richart",
    "通知/連線銀行",
  ];

  const daysThreshold = 7;
  const maxDate = new Date();

  maxDate.setDate(maxDate.getDate() - daysThreshold);

  const dateString = Utilities.formatDate(maxDate, Session.getScriptTimeZone(), "yyyy/MM/dd");

  labelPaths.forEach(labelPath => {
    const label = GmailApp.getUserLabelByName(labelPath);
    if (label) {
      const threads = label.getThreads().filter(thread => {
        return new Date(thread.getLastMessageDate()) < maxDate;
      });
      
      threads.forEach(thread => {
        GmailApp.moveThreadToTrash(thread);
      });
      
      console.log(`已刪除標籤「${labelPath}」中超過 ${daysThreshold} 天的信件，共 ${threads.length} 封。`);
    } else {
      console.log(`標籤「${labelPath}」不存在，跳過此標籤。`);
    }
  });
}
