export const initialStore = () => {
  const savedUser = localStorage.getItem("user");
  const savedProfile = localStorage.getItem("profile");
  const savedToken = localStorage.getItem("token");

  return {
    token: savedToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
    profile: savedProfile ? JSON.parse(savedProfile) : null,
    friends: [],
    clans: [],
    activeClanId: null,
    userTasks: [],
    clanTasks: [],
    personalBote: 0,
    personalExpenses: [],
    expenses: [],
    commonBote: {},
    balances: [],
    chatMessages: []
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {

    case "RESET_STORE":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profile");
      return initialStore();

    case "LOAD_DATA_FROM_BACKEND":
      const { user, profile, userTasks, clans, clanTasks, token } = action.payload;
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("profile", JSON.stringify(profile));
      return { 
        ...store,
        token: token || store.token,
        user,
        profile,
        userTasks: userTasks || [],
        clans: clans || [],
        clanTasks: clanTasks || []
      };

    case "SET_TOKEN":
      localStorage.setItem("token", action.payload.token);
      return { ...store, token: action.payload.token };

    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profile");
      return initialStore();

    case "ADD_USER_TASK":
      const newUserTask = {
        id: action.payload.id,
        title: action.payload.title,
        description: action.payload.description || "",
        address: action.payload.address || "",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        latitude: action.payload.lat,
        longitude: action.payload.lng,
        guests: [],
        completed: false
      };
      return { ...store, userTasks: [...store.userTasks, newUserTask] };

    case "UPDATE_USER_TASK":
      return {
        ...store,
        userTasks: store.userTasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };

    case "TOGGLE_USER_TASK":
      return {
        ...store,
        userTasks: store.userTasks.map(task =>
          task.id === action.payload.taskId ? { ...task, completed: !task.completed } : task
        )
      };

    case "DELETE_USER_TASK":
      return {
        ...store,
        userTasks: store.userTasks.filter(t => t.id !== action.payload.taskId)
      };

    case "ADD_TASK_TO_CLAN":
      if (!store.activeClanId) return store;
      const newClanTask = {
        id: new Date().getTime(),
        clanId: action.payload.clanId || store.activeClanId,
        title: action.payload.title,
        description: action.payload.description || "",
        address: action.payload.address || "",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        completed: false
      };
      return { ...store, clanTasks: [...store.clanTasks, newClanTask] };

    case "UPDATE_CLAN_TASK":
      return {
        ...store,
        clanTasks: store.clanTasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };

    case "TOGGLE_CLAN_TASK":
      return {
        ...store,
        clanTasks: store.clanTasks.map(task =>
          task.id === action.payload.taskId ? { ...task, completed: !task.completed } : task
        )
      };

    case "DELETE_CLAN_TASK":
      return {
        ...store,
        clanTasks: store.clanTasks.filter(t => t.id !== action.payload.taskId)
      };

    case "SET_ACTIVE_CLAN":
      return { ...store, activeClanId: action.payload.clanId };

    case "CREATE_CLAN":
      const newClan = {
        id: new Date().getTime(),
        members: 1,
        created: new Date().toISOString().split("T")[0],
        ...action.payload
      };
      return { ...store, clans: [...store.clans, newClan] };

    case "DELETE_CLAN":
      if (!store.activeClanId) return store;
      const remainingClans = store.clans.filter(c => c.id !== store.activeClanId);
      return {
        ...store,
        clans: remainingClans,
        activeClanId: remainingClans.length > 0 ? remainingClans[0].id : null
      };

    case "UPDATE_PROFILE":
      const updatedProfile = {
        ...store.profile,
        ...action.payload
      };
      localStorage.setItem("profile", JSON.stringify(updatedProfile));
      return { ...store, profile: updatedProfile };

    case "UPDATE_PERSONAL_BOTE":
      return { ...store, personalBote: parseFloat(action.payload.newBote) };

    case "ADD_PERSONAL_EXPENSE":
      const newPExpense = {
        id: new Date().getTime(),
        concept: action.payload.concept,
        amount: parseFloat(action.payload.amount),
        date: new Date().toISOString().split("T")[0]
      };
      return {
        ...store,
        personalBote: store.personalBote - newPExpense.amount,
        personalExpenses: [newPExpense, ...store.personalExpenses]
      };

    case "ADD_TO_BOTE":
      if (!store.activeClanId) return store;
      const currentAmount = store.commonBote[store.activeClanId] || 0;
      return {
        ...store,
        commonBote: {
          ...store.commonBote,
          [store.activeClanId]: currentAmount + parseFloat(action.payload.amount)
        }
      };

    case "ADD_EXPENSE":
      if (!store.activeClanId) return store;
      const newCExpense = {
        id: new Date().getTime(),
        clanId: store.activeClanId,
        concept: action.payload.concept,
        amount: parseFloat(action.payload.amount),
        paidBy: store.profile?.name,
        date: new Date().toISOString().split("T")[0]
      };
      const currentBote = store.commonBote[store.activeClanId] || 0;
      return {
        ...store,
        expenses: [newCExpense, ...store.expenses],
        commonBote: {
          ...store.commonBote,
          [store.activeClanId]: currentBote - newCExpense.amount
        }
      };

    case "SEND_MESSAGE":
      const newMsg = {
        id: new Date().getTime(),
        clanId: store.activeClanId,
        userId: store.user?.id,
        userName: store.profile?.name,
        text: action.payload.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true
      };
      return { ...store, chatMessages: [...store.chatMessages, newMsg] };

    default:
      return store;
  }
}