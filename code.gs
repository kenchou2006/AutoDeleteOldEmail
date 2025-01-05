function deleteOldEmails() {
  const parentLabelName = "通知";
  const daysThreshold = 7;
  const maxDate = new Date();

  maxDate.setDate(maxDate.getDate() - daysThreshold);
  const dateString = Utilities.formatDate(maxDate, Session.getScriptTimeZone(), "yyyy/MM/dd");

  let totalDeletedEmails = 0;

  const allLabels = GmailApp.getUserLabels();

  const parentLabel = GmailApp.getUserLabelByName(parentLabelName);
  if (parentLabel) {
    totalDeletedEmails += processLabelAndCountEmails(parentLabel, daysThreshold, maxDate);
  } else {
    console.log(`父標籤「${parentLabelName}」不存在，跳過此標籤。`);
  }

  allLabels.forEach(label => {
    if (label.getName().startsWith(`${parentLabelName}/`)) {
      totalDeletedEmails += processLabelAndCountEmails(label, daysThreshold, maxDate);
    }
  });

  console.log(`已完成父標籤與所有子標籤的信件刪除操作，共刪除 ${totalDeletedEmails} 封信件。`);
}

function processLabelAndCountEmails(label, daysThreshold, maxDate) {
  const threads = label.getThreads().filter(thread => {
    return new Date(thread.getLastMessageDate()) < maxDate;
  });

  let deletedEmailsCount = 0;

  threads.forEach(thread => {
    const messages = thread.getMessages();
    deletedEmailsCount += messages.length;
    GmailApp.moveThreadToTrash(thread);
  });

  console.log(`已刪除標籤「${label.getName()}」中超過 ${daysThreshold} 天的信件，共 ${deletedEmailsCount} 封。`);
  return deletedEmailsCount;
}
