import { Subject, Subscription, Observable, Subscriber, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';

const generateMockResult = (str: string): User[] => {
  const result: User[] = [];
  for (let i = 0; i <= str.length; i++) {
    result.push({
      id: i,
      name: `${str}_${i}`,
    });
  }
  return result;
};

interface User {
  id: number;
  name: string;
}

class AutocompleteController {
  /**
   * 每次用户输入任意值，都会从 payload$ 流中获得
   * 比如，用户依次输入 a, b, c
   * 那么 payload$ 流会获得三个值："a", "ab", "abc"
   */
  payload$: Subject<string>;

  subscription: Subscription;

  constructor() {
    this.payload$ = new Subject();
    this.subscription = this.getAutoSearch().subscribe();
  }

  // 更新 Input 框中的搜索词
  setSearchStr(str: string): void {
    console.log('setSearchStr', str);
  }
  // 更新搜索状态
  setLoading(isLoading: boolean): void {
    console.log('isLoading:', isLoading);
  }
  // 显示或隐藏警告信息
  toggleWarning(isShown?: boolean): void {
    if (isShown) {
      console.log('warning');
    }
  }
  // 发送请求，获取搜索结果
  searchQuery(str: string): Observable<User[]> {
    const search$: Observable<User[]> = new Observable(subscriber => {
      console.log('fetching network result');
      setTimeout(() => {
        subscriber.next(generateMockResult(str));
        subscriber.complete();
      }, 2000);
    });

    return search$;
  }
  // 更新搜索结果列表
  setSearchResults(users: User[]): void {
    console.log('get search result', users);
  }

  // 你要实现的方法
  getAutoSearch(): Observable<string> {
    const search$: Observable<string> = Observable.create(
      (observer: Subscriber<string>) => {
        let resultSubscription: Subscription | undefined;
        let stopQuery: boolean | undefined;

        this.payload$.subscribe({
          next: (v: string) => {
            if (v.length > 30) {
              stopQuery = true;
              this.toggleWarning(true);
              if (resultSubscription) {
                console.log('cancel pending request!');
                resultSubscription.unsubscribe();
                resultSubscription = undefined;
              }
            } else {
              stopQuery = false;
              this.toggleWarning();
            }
            this.setSearchStr(v);
          },
        });

        this.payload$.pipe(debounce(() => interval(500))).subscribe({
          next: (v: string) => {
            if (stopQuery) {
              return;
            }
            if (resultSubscription) {
              console.log('cancel pending request!');
              resultSubscription.unsubscribe();
              resultSubscription = undefined;
            }
            this.setLoading(true);

            const result = this.searchQuery(v);

            resultSubscription = result.subscribe({
              next: users => this.setSearchResults(users),
              error(err) {
                console.error('something wrong occurred: ' + err);
              },
              complete: () => {
                this.setLoading(false);
              },
            });
          },
          error: (err: Error) => observer.error(err),
          complete: () => observer.complete(),
        });
      },
    );

    return search$;
  }
}

const autocomplete = new AutocompleteController();

export default autocomplete;
