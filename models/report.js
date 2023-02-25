const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  _id: false,
  status: { type: String, enum: ["up", "down"], default: "up" },
  outages: { type: Number, default: 0 },
  downtime: { type: Number, default: 0 },
  uptime: { type: Number, default: 0 },
  history: [
    {
      responseTime: { type: Number, required: true },
      status: { type: String, enum: ["up", "down"], default: "up" },
    },
    { timeStamps: { createdAt: "timestamp", updatedAt: false } },
  ],
});

const virtualAvailability = reportSchema.virtual("availability");
virtualAvailability.get(function (value, virtual, doc) {
  if (!this.upTime) return "Can't Calculate Yet";

  const result = this.upTime / (this.upTime + this.downTime);

  return `${result}%`;
});

const avgResponseTime = reportSchema.virtual("avgResponseTime");
avgResponseTime.get(function (value, virtual, doc) {
  let responseMiliSecondSum = 0;
  let logsLength = this.history.length;

  const result = this.history.forEach((log) => {
    responseTimeSum += log.responseTime;
  });

  if (!responseMiliSecondSum || !logsLength) return 0;

  return responseTimeSum / logsLength;
});

reportSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = reportSchema;
