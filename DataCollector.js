export class DataCollector {
  constructor() {
    this.data = [];
    this.uploadInProgress = false;
  }

  add(entry) {
    this.data.push(entry);
  }

  upload() {
    if (this.uploadInProgress || this.data.length === 0) {
      return;
    }
    this.uploadInProgress = true;
    const that = this;
    const url =
      "https://7kxvbg3g33.execute-api.eu-central-1.amazonaws.com/prod/data";
    fetch(url, {
      method: "POST",
      body: JSON.stringify(this.data)
    })
      .then(function (res) {
        that.uploadInProgress = false;
        that.data = [];
      })
      .then(function (err) {
        that.uploadInProgress = false;
        that.data = [];
      });
  }
}
