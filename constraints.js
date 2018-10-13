/* @flow */

import type {
  Email,
  UUID,
  Phone,
  unsigned_number,
  TimeZone,
  PostalCode,
  Country,
  File,
  URL,
  IP,
  Socket,
  JsonProp
} from './types';
import * as validators from 'flow-runtime-validators';
import Moment from 'moment';
import MomentTimeZone from 'moment-timezone';
import fs from 'fs';
import validator from 'validator';
//import faker from 'faker'; // TODO
// TODO more fancy error message

Email.addConstraint(
  validators.length({max: 250}),
  it => {
    if (!validator.isEmail(it)) {
      return "must be valid Email";
    }
  }
);
//Email.prototype.faker = (it: string): Email => { faker.internet.email(); };
UUID.addConstraint(it => {
  if (!validator.isUUID(it, 4)) {
    return "must be valid UUID v4";
  }
});
//UUID.prototype.faker = (it: string): UUID => { faker.random.uuid(); };

Phone.addConstraint(
  it => {
    if (!validator.isMobilePhone(it, "any")) {
      return "must be valid phone number";
    }
  }
);
//Phone.prototype.faker = (it: string): Phone => { faker.phone.phoneNumber(); };

unsigned_number.addConstraint(
  validators.number({gt: -1})
);

TimeZone.addConstraint(
  it => {
    if (!!MomentTimeZone.tz.zone(it)) {
      // ok
    } else {
      return "must be valid time zone";
    }
  }
);

PostalCode.addConstraint(
  it => {
    if (!validator.isPostalCode(it, "any")) {
      return "must be valid postal code";
    }
  }
);
//PostalCode.prototype.faker = (it: string): PostalCode => { faker.address.zipCode(); };

Country.addConstraint(
  it => {
    if (!validator.isISO31661Alpha2(it, "any") || !validator.isUppercase(it)) {
      return "must be valid country code";
    }
  }
);
//Country.prototype.faker = (it: string): Country => { faker.address.countryCode(); };

// TODO contains(country.states())
// TODO contains(country.provinces())
File.addConstraint(
  it => {
    if (!fs.existsSync(it)) {
      return "not found";
    }
  }
);

URL.addConstraint(
  it => {
    if (!validator.isURL(it)) {
      return "must be valid URL";
    }
  }
);

JsonProp.addConstraint(
  it => {
    if (/[^a-zA-Z_]/.test(it)) {
      return "must be valid Json property name of /[a-zA-Z_]/";
    }
  }
);

export const isDomainNameSocketLike = (it: string): boolean => {
  return (/^[a-zA-Z0-9]+([-.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}:[0-9]+$/.test(it));
};

export const isDomainNameSocket = (it: string): boolean => {
  if (isDomainNameSocketLike(it)) {
    return validator.isPort(it.split(":")[1]);
  }
  return false;
};

export const isDomainName = (it: string): boolean => {
  return (/^[a-zA-Z0-9]+([-.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/.test(it));
};

export const isIpSocketLike = (it: string): boolean => {
  return (/^[0-9]+(.[0-9]{1,3}){1,3}:[0-9]+$/.test(it));
};

export const isIpSocket = (it: string): boolean => {
  if (isIpSocketLike(it)) {
    const ipSocket = it.split(":");
    return validator.isIP(ipSocket[0]) && validator.isPort(ipSocket[1]);
  }
  return false;
};

export const isSocket = (it: string): boolean => {
  return isIpSocket(it) || isDomainNameSocket(it);
};

Socket.addConstraint(
  it => {
    if (isSocket(it)) {
      return "must be valid socket";
    }
  }
);

IP.addConstraint(
  it => {
    if (!validator.isIP(it, 4)) {
      return "must be valid IP";
    }
  }
);

/*
FileName.addConstraint(
    it => {
        if (!/^[a-zA-Z_0-9\-]+$/.test(it)) {
            return "must be valid file name of /^[a-zA-Z_0-9\-]+$/";
        }
    }
);
*/

