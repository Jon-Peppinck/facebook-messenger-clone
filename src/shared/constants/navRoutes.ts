interface NavRoutes {
  key: string;
  title: string;
  focusedIcon: string;
}

export const navRoutes: NavRoutes[] = [
  {
    key: 'chats',
    title: 'Chats',
    focusedIcon: 'chat',
  },
  {key: 'calls', title: 'Calls', focusedIcon: 'video'},
  {key: 'people', title: 'People', focusedIcon: 'account'},
  {key: 'stories', title: 'Stories', focusedIcon: 'book'},
];
