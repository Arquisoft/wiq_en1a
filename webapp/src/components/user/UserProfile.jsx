import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const UserProfile = () => {
  const auth = useAuthUser();
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiEndpoint =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiEndpoint}/ranking/user`, {
          params: {
            username: auth.username,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return isLoading ? (
    <div class="area">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div
        class="flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900"
        style={{ height: "92.9vh" }}
      ></div>
    </div>
  ) : (
    <div class="area">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div
        class="flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900"
        style={{ height: "92.9vh" }}
      >
        <div className="items-center text-center text-gray-100 px-16 pb-8">
          <h2 className="my-8 text-2xl font-bold text-white md:text-4xl">
            {user.username}
          </h2>
          <p>Email: {user.email}</p>
          <p>Joined: {new Date(auth.createdAt).toLocaleDateString()}</p>
        </div>

        <div class="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div class="relative overflow-hidden rounded-lg border bg-white p-2">
            <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div class="space-y-2">
                <h3 class="font-bold">Global</h3>
                <p class="text-sm text-muted-foreground">
                  Total questions: {user.ranking.global.questions}
                </p>
                <p class="text-sm text-muted-foreground">
                  Correct questions: {user.ranking.global.correct}
                </p>
                <p class="text-sm text-muted-foreground">
                  Wrong questions: {user.ranking.global.wrong}
                </p>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-lg border bg-white p-2">
            <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div class="space-y-2">
                <h3 class="font-bold">Flags</h3>
                <p class="text-sm text-muted-foreground">
                  Total questions: {user.ranking.flags.questions}
                </p>
                <p class="text-sm text-muted-foreground">
                  Correct questions: {user.ranking.flags.correct}
                </p>
                <p class="text-sm text-muted-foreground">
                  Wrong questions: {user.ranking.flags.wrong}
                </p>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-lg border bg-white p-2">
            <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div class="space-y-2">
                <h3 class="font-bold">Cities</h3>
                <p class="text-sm text-muted-foreground">
                  Total questions: {user.ranking.cities.questions}
                </p>
                <p class="text-sm text-muted-foreground">
                  Correct questions: {user.ranking.cities.correct}
                </p>
                <p class="text-sm text-muted-foreground">
                  Wrong questions: {user.ranking.cities.wrong}
                </p>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-lg border bg-white p-2">
            <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div class="space-y-2">
                <h3 class="font-bold">Food</h3>
                <p class="text-sm text-muted-foreground">
                  Total questions: {user.ranking.foods.questions}
                </p>
                <p class="text-sm text-muted-foreground">
                  Correct questions: {user.ranking.foods.correct}
                </p>
                <p class="text-sm text-muted-foreground">
                  Wrong questions: {user.ranking.foods.wrong}
                </p>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-lg border bg-white p-2">
            <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div class="space-y-2">
                <h3 class="font-bold">Attractions</h3>
                <p class="text-sm text-muted-foreground">
                  Total questions: {user.ranking.tourist_attractions.questions}
                </p>
                <p class="text-sm text-muted-foreground">
                  Correct questions: {user.ranking.tourist_attractions.correct}
                </p>
                <p class="text-sm text-muted-foreground">
                  Wrong questions: {user.ranking.tourist_attractions.wrong}
                </p>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-lg border bg-white p-2">
            <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div class="space-y-2">
                <h3 class="font-bold">Monuments</h3>
                <p class="text-sm text-muted-foreground">
                  Total questions: {user.ranking.monuments.questions}
                </p>
                <p class="text-sm text-muted-foreground">
                  Correct questions: {user.ranking.monuments.correct}
                </p>
                <p class="text-sm text-muted-foreground">
                  Wrong questions: {user.ranking.monuments.wrong}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
