#!/usr/bin/env python3


def shell(ns=None, banner=None):
    'Start an interactive shell.'
    try:
        import IPython
    except ImportError:
        import code
        return code.interact(banner, local=ns)
    else:
        params = dict(user_ns=ns)
        if banner is not None:
            params['banner1'] = banner
        return IPython.embed(**params)


if __name__ == '__main__':
    shell()