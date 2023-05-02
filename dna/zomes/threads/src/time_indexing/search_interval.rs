use std::fmt::*;
use std::ops::{Add, Sub};
use hdk::prelude::*;
use zome_utils::zome_error;

/// Time interval in us
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchInterval {
  pub begin: Timestamp,
  pub end: Timestamp,
}


impl Display for SearchInterval {
  fn fmt(&self, f: &mut Formatter<'_>) -> Result {
    let duration = self.duration().as_seconds_and_nanos().0;
    write!(f,
      "[{}, {}] (duration: {} secs)",
      self.begin.as_seconds_and_nanos().0, self.end.as_seconds_and_nanos().0, duration
    )
  }
}

impl Default for SearchInterval {
  fn default() -> Self {
    Self {
      begin: Timestamp::HOLOCHAIN_EPOCH,
      end: Timestamp::HOLOCHAIN_EPOCH,
    }
  }
}


impl SearchInterval {

  ///
  pub fn now() -> Self {
    Self { begin: Timestamp::HOLOCHAIN_EPOCH, end: sys_time().unwrap() }
  }

  ///
  pub fn with_beginning_at(begin: Timestamp) -> Self {
    Self { begin, end: sys_time().unwrap() }
  }

  ///
  pub fn with_end_at(end: Timestamp) -> Self {
    Self { begin: Timestamp::HOLOCHAIN_EPOCH, end, }
  }

  ///
  pub fn new(begin: Timestamp, end: Timestamp) -> ExternResult<Self> {
    if end < begin {
      return zome_error!("Invalid TimeInterval end < begin");
    }
    if begin.0 < 0 {
      return zome_error!("Invalid TimeInterval begin < 0");
    }
    Ok(Self { begin, end })
  }


  ///
  pub fn duration(&self) -> Timestamp {
    // let duration = self.end.sub(self.begin)?;
    // let ts: Timestamp = duration.into();
    // Ok(ts)
    let diff = self.end.0 - self.begin.0;
    Timestamp::from_micros(diff)
  }

  ///
  pub fn overlaps(&self, other: &Self) -> bool {
    self.begin <= other.end && self.end >= other.begin
  }


  /// Convert into start time of begin bucket and finish time of end bucket
  /// CAUTIOUS: end bucket finish time is equal to next bucket start time
  pub fn into_hour_buckets(&self) -> Self {
    let start_time_us = Timestamp::from_micros((self.begin.as_seconds_and_nanos().0 / 3600) * 3600 * 1000 * 1000);
    let end_hour_plus_1 = (self.end.as_seconds_and_nanos().0 / 3600) + 1;
    let finish_time_us = Timestamp::from_micros( end_hour_plus_1 * 3600 * 1000 * 1000);
    return SearchInterval::new(start_time_us, finish_time_us).unwrap();
  }


  ///
  pub fn get_end_bucket_start_time(&self) -> Timestamp {
    let hour = Timestamp::try_from(std::time::Duration::from_secs(3600)).unwrap();
    let diff = self.end.0 - hour.0;
    Timestamp::from_micros(diff)
  }

}