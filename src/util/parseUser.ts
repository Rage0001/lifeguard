export function parseUser(user: string): string {
  if (user.startsWith('<@') && user.endsWith('>')) {
    user = user.slice(2, -1);

    if (user.startsWith('!')) {
      user = user.slice(1);
    }

    return user;
  } else {
    return user;
  }
}
