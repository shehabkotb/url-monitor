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
      type: new Schema(
        {
          responseTime: { type: Number, required: true },
          status: { type: String, enum: ["up", "down"], default: "up" },
        },
        { timestamps: { createdAt: "timestamp", updatedAt: false } }
      ),
    },
  ],
});

const virtualAvailability = reportSchema.virtual("availability");
virtualAvailability.get(function (value, virtual, doc) {
  if (!this.uptime) return "Can't Calculate Yet";

  const result = this.uptime / (this.uptime + this.downtime);

  return `${Math.round(result * 100)}%`;
});

const avgResponseTime = reportSchema.virtual("avgResponseTime");
avgResponseTime.get(function (value, virtual, doc) {
  let responseMiliSecondSum = 0;
  let logsLength = 0;

  // we calculate avg resoponse on up responses only
  const result = this.history.forEach((log) => {
    if (log.status === "up") {
      responseMiliSecondSum += log.responseTime;
      logsLength += 1;
    }
  });

  if (!responseMiliSecondSum || !logsLength) return 0;

  return responseMiliSecondSum / logsLength;
});

reportSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = reportSchema;
