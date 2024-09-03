import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
  SelectField,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/api";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    const { data: clients } = await client.models.Client.list();
    console.log(clients);
    setClients(clients);
  }

  async function createClient(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    const { data: newClient } = await client.models.Client.create({
      first_name: form.get("first_name"),
      last_name: form.get("last_name"),
      date_of_birth: form.get("date_of_birth"),
      gender: form.get("gender"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      notes: form.get("notes"),
    });

    console.log(newClient);
    fetchClients();
    event.target.reset();
  }

  async function deleteClient({ client_id }) {
    const toBeDeletedClient = {
      client_id: client_id,
    };

    const { data: deletedClient } = await client.models.Client.delete(
      toBeDeletedClient
    );
    console.log(deletedClient);

    fetchClients();
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <Flex
          className="App"
          justifyContent="center"
          alignItems="center"
          direction="column"
          width="70%"
          margin="0 auto"
        >
          <Heading level={1}>Управление клиентами</Heading>
          <View as="form" margin="3rem 0" onSubmit={createClient}>
            <Flex
              direction="column"
              justifyContent="center"
              gap="1rem"
              padding="2rem"
            >
              <TextField
                name="first_name"
                placeholder="Имя"
                label="Имя"
                variation="quiet"
                required
              />
              <TextField
                name="last_name"
                placeholder="Фамилия"
                label="Фамилия"
                variation="quiet"
                required
              />
              <TextField
                name="date_of_birth"
                placeholder="Дата рождения"
                label="Дата рождения"
                type="date"
                variation="quiet"
              />
              <SelectField
                name="gender"
                label="Пол"
                variation="quiet"
              >
                <option value="Male">Мужской</option>
                <option value="Female">Женский</option>
                <option value="Other">Другой</option>
              </SelectField>
              <TextField
                name="email"
                placeholder="Email"
                label="Email"
                type="email"
                variation="quiet"
              />
              <TextField
                name="phone"
                placeholder="Телефон"
                label="Телефон"
                type="tel"
                variation="quiet"
              />
              <TextField
                name="address"
                placeholder="Адрес"
                label="Адрес"
                variation="quiet"
              />
              <TextField
                name="notes"
                placeholder="Заметки"
                label="Заметки"
                variation="quiet"
              />
              <Button type="submit" variation="primary">
                Добавить клиента
              </Button>
            </Flex>
          </View>
          <Divider />
          <Heading level={2}>Список клиентов</Heading>
          <Grid
            margin="3rem 0"
            columnGap="2rem"
            rowGap="2rem"
            templateColumns="1fr 1fr"
          >
            {clients.map((client) => (
              <Flex
                key={client.client_id}
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                gap="1rem"
                border="1px solid #ccc"
                padding="2rem"
                borderRadius="5px"
                className="box"
              >
                <Heading level="3">{client.first_name} {client.last_name}</Heading>
                <Text>Email: {client.email}</Text>
                <Text>Телефон: {client.phone}</Text>
                <Text>Дата рождения: {client.date_of_birth}</Text>
                <Text>Пол: {client.gender}</Text>
                <Text>Адрес: {client.address}</Text>
                <Text>Заметки: {client.notes}</Text>
                <Button
                  variation="destructive"
                  onClick={() => deleteClient(client)}
                >
                  Удалить клиента
                </Button>
              </Flex>
            ))}
          </Grid>
          <Button onClick={signOut}>Выйти</Button>
        </Flex>
      )}
    </Authenticator>
  );
}
