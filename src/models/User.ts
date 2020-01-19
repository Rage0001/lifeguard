interface UserInfraction {
  action: 'Warn' | 'Mute' | 'Tempban' | 'Ban';
  active: boolean;
  guild: string;
  id: number;
  moderator: string;
  reason: string;
  time: Date;
}

export interface UserDoc {
  blacklisted?: boolean;
  id: string;
  infractions: UserInfraction[];
}

export class User implements UserDoc {
  blacklisted: boolean;
  id: string;
  infractions: UserInfraction[];
  constructor(data: UserDoc) {
    this.blacklisted = data.blacklisted ?? false;
    this.id = data.id;
    this.infractions = data.infractions;
  }
}
