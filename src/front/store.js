export const initialStore = () => {
  const savedProfile = localStorage.getItem("profile");
  return {
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    profile: savedProfile
      ? JSON.parse(savedProfile)
      : {
          name: "Nombre de Usuario",
          email: "correo@delusuario.com",
          avatar: "https://res.cloudinary.com/dmx0zjkej/image/upload/v1762540958/LOGO_600_x_600_muoehy.png",
          presentation: "Hola! Soy nuevo en TaskFlow.",
          location: "Madrid, ES",
          age: 26,
          phone: "666 000 666",
          gender: "Sin especificar",
          social: { instagram: "", twitter: "", facebook: "" },
        },
    friends: [
      { id: 1, name: "Amigo Uno", status: "online", avatar: "https://i.pravatar.cc/150?img=11" },
      { id: 2, name: "Amiga Dos", status: "offline", avatar: "https://i.pravatar.cc/150?img=12" },
    ],
    clans: [
      { id: 1, name: "Los geek's", category: "Trabajo", members: 4, created: "2025-11-03" },
      { id: 2, name: "Familia", category: "Familia", members: 3, created: "2025-10-01" },
    ],
    activeClanId: 1,
    userTasks: [
      { 
        id: 1, 
        title: "Revisar el correo", 
        description: "Responder a los clientes pendientes", 
        date: "2025-11-21", 
        time: "09:00",
        address: "Oficina", 
        completed: false 
      },
    ],
    clanTasks: [
      { id: 101, clanId: 1, title: "Deploy a producción", description: "Subir cambios al servidor", date: "2025-11-22", time: "14:00", completed: false },
      { id: 102, clanId: 2, title: "Comprar regalo mamá", description: "Cumpleaños es el domingo", date: "2025-11-25", time: "18:00", completed: false },
    ],
    personalBote: 119.58,
    personalExpenses: [
      { id: 1, concept: "Café", amount: 1.5, date: "2025-11-20" }
    ],
    expenses: [],
    commonBote: { 1: 150.00, 2: 50.00 },
    balances: [],
    chatMessages: [
      { id: 1, clanId: 1, userId: 2, userName: "Amigo Uno", text: "Hola equipo", time: "10:00", isMe: false },
      { id: 2, clanId: 1, userId: 99, userName: "Yo", text: "¡Hola! Listos para trabajar", time: "10:05", isMe: true },
      { id: 3, clanId: 2, userId: 99, userName: "Yo", text: "¿Quién compra la cena?", time: "20:00", isMe: true },
    ]
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "LOAD_DATA_FROM_BACKEND":
      const profile = {
        ...store.profile,
        ...action.payload.profile,
        social: action.payload.profile?.social || store.profile.social || { instagram: "", twitter: "", facebook: "" }
      };
      localStorage.setItem("user", JSON.stringify(action.payload.user || store.user));
      localStorage.setItem("profile", JSON.stringify(profile));
      return {
        ...store,
        user: action.payload.user || store.user,
        profile,
        userTasks: action.payload.userTasks || [],
        clans: action.payload.clans || [],
        clanTasks: action.payload.clanTasks || [],
      };
    case "SET_TOKEN":
      localStorage.setItem("token", action.payload.token);
      return { ...store, token: action.payload.token };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profile");
      return { ...store, token: null, user: null };
    case "ADD_USER_TASK":
      const newUserTask = {
        id: new Date().getTime(),
        title: action.payload.title,
        description: action.payload.description || "",
        address: action.payload.address || "Ubicación no especificada",
        date: new Date().toLocaleDateString(), 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        guests: [], 
        completed: false,
      };
      return { ...store, userTasks: [...store.userTasks, newUserTask] };
    case "UPDATE_USER_TASK":
      return { ...store, userTasks: store.userTasks.map((task) => task.id === action.payload.id ? { ...task, ...action.payload } : task) };
    case "TOGGLE_USER_TASK":
      return { ...store, userTasks: store.userTasks.map((task) => task.id === action.payload.taskId ? { ...task, completed: !task.completed } : task) };
    case "DELETE_USER_TASK":
      return { ...store, userTasks: store.userTasks.filter((t) => t.id !== action.payload.taskId) };
    case "ADD_TASK_TO_CLAN":
      if (!store.activeClanId) return store;
      const newClanTask = {
        id: new Date().getTime(),
        clanId: action.payload.clanId || store.activeClanId,
        title: action.payload.title,
        description: action.payload.description || "",
        address: action.payload.address || "",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: false,
      };
      return { ...store, clanTasks: [...store.clanTasks, newClanTask] };
    case "UPDATE_CLAN_TASK":
      return { ...store, clanTasks: store.clanTasks.map((task) => task.id === action.payload.id ? { ...task, ...action.payload } : task) };
    case "TOGGLE_CLAN_TASK":
      return { ...store, clanTasks: store.clanTasks.map((task) => task.id === action.payload.taskId ? { ...task, completed: !task.completed } : task) };
    case "DELETE_CLAN_TASK":
      return { ...store, clanTasks: store.clanTasks.filter((t) => t.id !== action.payload.taskId) };
    case "SET_ACTIVE_CLAN":
      return { ...store, activeClanId: action.payload.clanId };
    case "CREATE_CLAN":
      const newClan = { id: new Date().getTime(), members: 1, created: new Date().toISOString().split('T')[0], ...action.payload };
      return { ...store, clans: [...store.clans, newClan] };
    case "DELETE_CLAN":
      if (!store.activeClanId) return store;
      const remainingClans = store.clans.filter(c => c.id !== store.activeClanId);
      return { ...store, clans: remainingClans, activeClanId: remainingClans.length > 0 ? remainingClans[0].id : null };
    case "UPDATE_PROFILE":
      const updatedProfile = {
        ...store.profile,
        ...action.payload,
        social: action.payload.social || store.profile.social || { instagram: "", twitter: "", facebook: "" }
      };
      localStorage.setItem("profile", JSON.stringify(updatedProfile));
      return { ...store, profile: updatedProfile };
    case "UPDATE_PERSONAL_BOTE":
      return { ...store, personalBote: parseFloat(action.payload.newBote) };
    case "ADD_PERSONAL_EXPENSE":
      const newPExpense = { id: new Date().getTime(), concept: action.payload.concept, amount: parseFloat(action.payload.amount), date: new Date().toISOString().split("T")[0] };
      return { ...store, personalBote: store.personalBote - newPExpense.amount, personalExpenses: [newPExpense, ...store.personalExpenses] };
    case "ADD_TO_BOTE":
      if (!store.activeClanId) return store;
      const currentAmount = store.commonBote[store.activeClanId] || 0;
      return { ...store, commonBote: { ...store.commonBote, [store.activeClanId]: currentAmount + parseFloat(action.payload.amount) } };
    case "ADD_EXPENSE":
      if (!store.activeClanId) return store;
      const newCExpense = { id: new Date().getTime(), clanId: store.activeClanId, concept: action.payload.concept, amount: parseFloat(action.payload.amount), paidBy: store.profile.name, date: new Date().toISOString().split("T")[0] };
      const currentBote = store.commonBote[store.activeClanId] || 0;
      return { ...store, expenses: [newCExpense, ...store.expenses], commonBote: { ...store.commonBote, [store.activeClanId]: currentBote - newCExpense.amount } };
    case "SEND_MESSAGE":
      const newMsg = { id: new Date().getTime(), clanId: store.activeClanId, userId: store.user?.id || 99, userName: store.profile.name, text: action.payload.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true };
      return { ...store, chatMessages: [...store.chatMessages, newMsg] };
    default:
      return store;
  }
}