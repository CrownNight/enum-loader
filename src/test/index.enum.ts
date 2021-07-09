export enum ActivityStatus {
  /**
   * @name PENDING
   * @description 待开始
   */
  PENDING = "PENDING",
  /**
   * @name OPENED
   * @description 进行中
   */
  OPENED = "OPENED",
  /**
   * @name STOP
   * @description 已停止
   */
  STOP = "STOP",
  /**
   * @name ENDED
   * @description 已结束
   */
  ENDED = "ENDED",
}
/**
 * 活动状态字典
 */
export const ActivityStatusDic: { [key: string]: string } = {
  [ActivityStatus.PENDING]: "待开始",
  [ActivityStatus.OPENED]: "进行中",
  [ActivityStatus.STOP]: "已停止",
  [ActivityStatus.ENDED]: "已结束",
};

// export enum BizTypeEnum {
//   RECHARGE_REWARD = "RECHARGE_REWARD",
//   CONSUME_REWARD = "CONSUME_REWARD",
// }
//@ts-ignore
window.ENUM = {
  ActivityStatus,
  //BizTypeEnum,
};
